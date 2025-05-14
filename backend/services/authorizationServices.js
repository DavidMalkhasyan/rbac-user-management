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
        const token = this.generateToken(email);
        const link = `http://localhost:3000/authorization/verify?token=${token}`;

        try {
            await this.sendEmail(
                email,
                "Authorization Link",
                `Click here to authorize: ${link}`
            );
            await User.updateOne(
                { email },
                {
                    $setOnInsert: {
                        email,
                        role: role || "user",
                        status: "not Active",
                        permissions: {
                            canEditClients: canEditClients || false,
                            canDeleteClients: canDeleteClients || false,
                            canAddClients: canAddClients || false,
                        },
                    },
                },
                { upsert: true }
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

    generateToken(email) {
        return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });
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
            console.log({ email: decoded.email })
            const user = await User.findOne({ email: decoded.email });

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
            return res
                .status(400)
                .json({ message: "Email and password are required" });
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
        const token = this.generateToken(user.username);
        return {
            status: 200,
            message: "Login successful",
            token,
            user: {
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                permissions: user.permissions,
                id: user._id,
            },
        };
    }

    async sendPasswordRecovery({ email }) {
        const token = this.generateToken(email);
        const link = `http://localhost:3000/authorization/verifyPasswordRecovery?token=${token}`;
        try {
            await this.sendEmail(
                email,
                "Password Recovery",
                `Click here to reset your password: ${link}`,
                "If you did not request this, please ignore this email."
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
    
            const user = await User.findOne({ email: decoded.email });
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
