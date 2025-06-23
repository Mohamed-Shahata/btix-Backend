import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASS
  }
});

interface SendMailOptions {
  to: string,
  subject: string,
  template: string,
  data: Record<string, any>
};

export const sendMail = async ({ to, subject, template, data }: SendMailOptions) => {
  try {
    const templatePath = path.resolve('src', 'templates', template.endsWith('.ejs') ? template : `${template}.ejs`);
    const html = await ejs.renderFile(templatePath, data);

    const mailOptions = {
      from: `"BITX" <${process.env.GOOGLE_EMAIL}>`,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Mail sent successfully");

  } catch (error) {
    console.error("❌ Error sending mail:", error);
  }
};
