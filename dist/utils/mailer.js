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
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "009fc9f1384531",
        pass: "7e889c31d5cb7a"
    }
});
;
const sendMail = async ({ to, subject, template, data }) => {
    try {
        const templatePath = path_1.default.resolve('src', 'templates', template);
        const html = await ejs_1.default.renderFile(templatePath, data);
        const mailOptions = {
            from: "My app",
            to,
            subject,
            html
        };
        await transporter.sendMail(mailOptions);
        console.log("send mail success");
    }
    catch (error) {
        console.log("error mailer: ", error);
    }
};
exports.sendMail = sendMail;
