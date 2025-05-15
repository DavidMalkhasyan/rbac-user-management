import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

export default function envConfig() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    dotenv.config({
        path: `${path.join(__dirname, "..", `.${process.env.NODE_ENV}.env`)}`,
    });
}
