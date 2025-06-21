import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "009fc9f1384531",
    pass: "7e889c31d5cb7a"
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
    const templatePath = path.resolve('src', 'templates', template);

    const html = await ejs.renderFile(templatePath, data);


    const mailOptions = {
      from: "My app",
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log("send mail success");

  } catch (error) {
    console.log("error mailer: ", error);
  }
};