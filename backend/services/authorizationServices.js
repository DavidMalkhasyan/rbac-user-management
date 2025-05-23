import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

class AuthorizationServices {
    async sendAuthorizationLink({
        email,
        role,
        canEditClients,
        canDeleteClients,
        canAddClients,
    }) {
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                role: role || "user",
                status: "not Active",
                permissions: {
                    canEditClients: canEditClients || false,
                    canDeleteClients: canDeleteClients || false,
                    canAddClients: canAddClients || false,
                },
            });
        }

        const token = this.generateToken(user);
        const link = `http://localhost:3000/authorization/verify?token=${token}`;

        try {
            await this.sendEmail(
                email,
                "Authorization Link",
                `Click here to authorize: ${link}`
            );
            return {
                status: 200,
                message: "Authorization link sent successfully",
            };
        } catch (error) {
            console.error(error);
            return {
                status: 500,
                message: "Error sending authorization link",
            };
        }
    }

    generateToken(user) {
        return jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
    }

    async sendEmail(to, subject, text) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        return transporter.sendMail(mailOptions);
    }

    async verifyToken(
        token,
        { firstName, lastName, phone, username, password }
    ) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return {
                    status: 404,
                    message: "User not found",
                };
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            user.status = "active";
            user.firstName = firstName;
            user.lastName = lastName;
            user.phone = phone;
            user.username = username;
            user.password = hashedPassword;

            await user.save();

            return {
                status: 200,
                message: "User verified successfully",
            };
        } catch (error) {
            console.error(error);
            return {
                status: 500,
                message: "Error verifying token",
            };
        }
    }

    async login({ username, password }) {
        if (!username || !password) {
            return {
                status: 400,
                message: "Email and password are required",
            };
        }

        const user = await User.findOne({ username });
        if (!user) {
            return {
                status: 404,
                message: "User not found",
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return {
                status: 401,
                message: "Invalid password",
            };
        }

        const token = this.generateToken(user);
        return {
            status: 200,
            token,
        };
    }

    async sendPasswordRecovery({ email }) {
        const user = await User.findOne({ email });
        if (!user) {
            return {
                status: 404,
                message: "User not found",
            };
        }

        const token = this.generateToken(user);
        const link = `http://localhost:3000/authorization/verifyPasswordRecovery?token=${token}`;
        try {
            await this.sendEmail(
                email,
                "Password Recovery",
                `Click here to reset your password: ${link}`
            );
            return {
                status: 200,
                message: "Password recovery link sent successfully",
            };
        } catch (error) {
            console.error(error);
            return {
                status: 500,
                message: "Error sending password recovery link",
            };
        }
    }

    async verifyPasswordRecovery(token, { password }) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return {
                    status: 404,
                    message: "User not found",
                };
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);
            user.password = hashedPassword;

            await user.save();
            return {
                status: 200,
                message: "Password updated successfully",
            };
        } catch (error) {
            console.error("Token verification error:", error.message);
            return {
                status: 500,
                message: "Invalid or expired token",
            };
        }
    }
}

export default new AuthorizationServices();
