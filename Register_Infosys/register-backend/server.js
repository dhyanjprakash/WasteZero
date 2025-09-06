const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const client = new MongoClient(process.env.MONGO_URI);
let usersCollection;

// ✅ Connect to MongoDB Atlas
async function connectDB() {
  try {
    await client.connect();
    const db = client.db("authDB");
    usersCollection = db.collection("users");
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  }
}
connectDB();

// ✅ Nodemailer transporter with Gmail (App Password Required)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Must be an App Password
  },
  tls: {
    rejectUnauthorized: false, // For local dev (optional, helps avoid SSL errors)
  },
});

// ✅ Verify email transport
transporter.verify((error, success) => {
  if (error) console.error("❌ Email transporter error:", error);
  else console.log("✅ Email transporter is ready");
});

// ✅ OTP Storage (in-memory)
const otpStore = {};

// ✅ Send OTP
app.post("/send-otp", (req, res) => {
  let { email } = req.body;
  if (!email) return res.status(400).send("Email is required");

  email = email.toLowerCase();
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  otpStore[email] = otp;

  const mailOptions = {
    from: `"WasteZero" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your WasteZero Email Verification OTP",
    text: `Your OTP for WasteZero registration is: ${otp}`,
    html: `<p>Your OTP for WasteZero registration is: <strong>${otp}</strong></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error sending OTP email:", error);
      return res.status(500).send("Failed to send OTP email");
    }
    console.log(`📧 OTP sent to ${email}: ${otp}`);
    res.status(200).send("OTP sent successfully");
  });
});

// ✅ Verify OTP
app.post("/verify-otp", (req, res) => {
  let { email, otp } = req.body;
  if (!email || !otp) return res.status(400).send("Email and OTP are required");

  email = email.toLowerCase();

  if (otpStore[email] === otp) {
    delete otpStore[email]; // Remove OTP after successful verification
    return res.status(200).send("OTP verified successfully");
  } else {
    return res.status(400).send("Invalid or expired OTP");
  }
});

// ✅ Register New User
app.post("/register", async (req, res) => {
  try {
    let { username, email, password, role, skills, location, gender } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send("All required fields must be filled");
    }

    email = email.toLowerCase();

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      role,
      skills,
      location,
      gender,
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);
    res.status(201).send("✅ Registration successful. Please login.");
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).send("Server error during registration");
  }
});

// ✅ Login Endpoint
app.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password required");
    }

    email = email.toLowerCase();
    const user = await usersCollection.findOne({ email });

    if (!user) return res.status(400).send("Invalid email or password");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).send("Invalid email or password");

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).send("Server error during login");
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
