const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));

// Example route to handle email sending
app.post("/api/v1/portfolio/sendEmail", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    console.error("Missing required fields:", req.body);
    return res.status(400).json({ error: "Missing required fields" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER, // Use environment variable for the email address
    to: process.env.GMAIL_USER, // Replace with your email address if needed
    subject: `Email from ${name} from MERN Portfolio`,
    html: `
      <h4>Details Information</h4>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Message:</strong> ${message}</li>
      </ul>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Catch-all handler for any requests to an unknown route
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html")); // Ensure correct path to index.html
});

// Set port and start server
const PORT = process.env.PORT || 8080; // Ensure the server listens on the correct port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
