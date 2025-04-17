const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const gmailEmail = "your-email@gmail.com"; // Replace with your email
const gmailPassword = "your-app-password"; // Replace with your app password

// Configure mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Function to send email notification
exports.sendLoginNotification = functions.https.onRequest((req, res) => {
  const { email, timestamp, action } = req.body;

  if (!email || !timestamp || !action) {
    return res.status(400).send("Missing required fields.");
  }

  const mailOptions = {
    from: `Login Tracker <${gmailEmail}>`,
    to: email,
    subject: `Account ${action} Alert`,
    text: `Your account was ${action} at ${timestamp}.
           If this wasn't you, please secure your account.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email.");
    }
    console.log("Email sent:", info.response);
    return res.status(200).send("Email sent successfully.");
  });
});