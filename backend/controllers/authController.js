import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer"; // fallback only

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email and password are required" });
    }

    // Check if username or email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already registered" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: "Username already taken" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user with only username, email and hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- new Google OAuth handlers ---
export const googleAuthUrl = (req, res) => {
  // Build Google OAuth URL and redirect the browser there
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI; // e.g. http://localhost:5000/api/auth/google/callback
  const scope = encodeURIComponent("openid email profile");
  if (!clientId || !redirectUri) {
    return res.status(500).send("Google OAuth not configured on server");
  }

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  return res.redirect(url);
};

export const googleAuthCallback = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).send("Missing code");
    }

    const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code"
      })
    });

    if (!tokenResp.ok) {
      const text = await tokenResp.text().catch(()=>"");
      console.error("Google token exchange failed:", tokenResp.status, text);
      return res.status(502).send("Failed to exchange code for tokens");
    }

    const tokenData = await tokenResp.json();
    const idToken = tokenData.id_token;
    if (!idToken) {
      return res.status(502).send("No id_token returned by Google");
    }

    // id_token is a JWT — decode payload to get user info
    const decoded = jwt.decode(idToken);
    const email = decoded?.email;
    const name = decoded?.name || decoded?.email?.split("@")[0];

    if (!email) {
      return res.status(502).send("Google id_token missing email");
    }

    // find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // create a username from name/email and a random password placeholder
      const usernameBase = name.replace(/\s+/g, "_").toLowerCase().slice(0, 20);
      let username = usernameBase;
      // ensure unique username
      let i = 1;
      while (await User.findOne({ username })) {
        username = `${usernameBase}${i++}`;
      }

      const randomPass = Math.random().toString(36).slice(2, 12);
      const hashed = await bcrypt.hash(randomPass, 10);

      user = new User({
        username,
        email,
        password: hashed
      });
      await user.save();
    }

    // issue our JWT for the frontend
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // redirect back to frontend with token and username in query (frontend will parse and store)
    const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
    const redirectTo = `${clientOrigin.replace(/\/$/, "")}/login?token=${encodeURIComponent(token)}&username=${encodeURIComponent(user.username)}`;

    return res.redirect(redirectTo);
  } catch (err) {
    console.error("googleAuthCallback error:", err);
    return res.status(500).send("Server error in Google callback");
  }
};

// New: request password reset — generates token, saves to user, sends email
export const forgotPassword = async (req, res) => {
  try {
    console.log("🔵 forgotPassword called with body:", req.body);
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      console.log("⚠️ User not found for email:", email);
      return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
    }

    console.log("✅ User found:", user.email);
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600 * 1000);
    await user.save();
    console.log("✅ Token saved:", token);

    const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
    const resetUrl = `${clientOrigin.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`;
    console.log("🔗 Reset URL:", resetUrl);

    const subject = "Cura AI — Password reset";
    const text = `You requested a password reset. This link is valid for 1 hour:\n\n${resetUrl}`;
    const html = `<p>You requested a password reset. This link is valid for 1 hour:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`;

    const fromAddress = process.env.EMAIL_FROM || "Cura AI <no-reply@curaai.local>";

    if (process.env.SENDGRID_API_KEY) {
      // SendGrid path
      try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = { to: user.email, from: fromAddress, subject, text, html };
        console.log("📨 Sending via SendGrid to:", user.email);
        sgMail.send(msg)
          .then(() => console.log("✅ SendGrid email sent"))
          .catch(err => console.error("❌ SendGrid error:", err.response?.body || err.message));
      } catch (sgErr) {
        console.error("❌ SendGrid setup/send failed:", sgErr.message);
      }
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Fallback SMTP
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === "true",
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });
        const mailOptions = { from: fromAddress, to: user.email, subject, text, html };
        console.log("📨 Sending via SMTP to:", user.email);
        transporter.sendMail(mailOptions)
          .then(info => console.log("✅ SMTP email sent:", info.response))
          .catch(err => console.error("❌ SMTP send error:", err.code, err.message));
      } catch (smtpErr) {
        console.error("❌ SMTP setup failed:", smtpErr.message);
      }
    } else {
      console.error("❌ No email provider configured (SENDGRID_API_KEY or SMTP_* missing)");
    }

    // Immediate response (do not await email)
    return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error("❌ forgotPassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// New: perform password reset using token
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) return res.status(400).json({ message: "Token and new password are required" });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password has been reset. You can now log in." });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
