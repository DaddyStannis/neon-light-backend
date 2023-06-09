import nodemailer from "nodemailer";

const { NODEMAILER_EMAIL, NODEMAILER_PASSWORD } = process.env;

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
};

const transport = nodemailer.createTransport(config);

async function sendEmail({ html, subject, to, attachments }) {
  // attachments must be an array of objects that contain the filename and path
  const email = {
    from: NODEMAILER_EMAIL,
    to,
    subject,
    html,
  };

  if (attachments) {
    email.attachments = attachments;
  }

  try {
    await transport.sendMail(email);
  } catch (error) {
    console.log(error.message);
  }
}

export default sendEmail;
