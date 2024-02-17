const nodemailer = require('nodemailer');

const sendEmail = async (opts) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOpts = {
    from: 'Project Hub <projectHub@support.io>',
    to: opts.email,
    subject: opts.subject,
    text: opts.message,
  };
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
