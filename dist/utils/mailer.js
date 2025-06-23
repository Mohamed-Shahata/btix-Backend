"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASS
    }
});
;
const sendMail = async ({ to, subject, template, data }) => {
    try {
        const templatePath = path_1.default.resolve('src', 'templates', template.endsWith('.ejs') ? template : `${template}.ejs`);
        const html = await ejs_1.default.renderFile(templatePath, data);
        const mailOptions = {
            from: `"BITX" <${process.env.GOOGLE_EMAIL}>`,
            to,
            subject,
            html
        };
        await transporter.sendMail(mailOptions);
        console.log("✅ Mail sent successfully");
    }
    catch (error) {
        console.error("❌ Error sending mail:", error);
    }
};
exports.sendMail = sendMail;
