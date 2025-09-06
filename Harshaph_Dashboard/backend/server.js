const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
// Store OTPs for password reset
const otpStore = new Map();

// Middleware
app.use(cors());
app.use(express.json());

// Mock database (replace with your actual database)
const users = [
  {
    id: 1,
    email: 'test@example.com',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Gi', // "password123"
    name: 'Test User'
  },
  {
    id: 2,
    email: 'abhignavarma05@gmail.com',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Gi', // "password123" (default)
    name: 'Abhigna Varma'
  }
];

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email
async function sendOTP(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: email,
    subject: 'Password Reset Verification Code - WasteZero',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2ECC71; margin: 0;">WasteZero</h1>
          <p style="color: #7F8C8D; margin: 10px 0;">Smart Waste Pickup & Recycling Platform</p>
        </div>
        
        <div style="background: #F8F9FA; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="color: #2C3E50; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #7F8C8D; margin-bottom: 25px; line-height: 1.6;">
            You have requested to reset your password for your WasteZero account.
          </p>
          
          <div style="background: #2ECC71; color: white; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin: 0; font-size: 24px;">Your Verification Code</h3>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 15px 0;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #E74C3C; font-size: 14px; margin: 20px 0;">
            ⚠️ This code will expire in 10 minutes
          </p>
          
          <p style="color: #7F8C8D; font-size: 14px; margin: 20px 0;">
            If you didn't request this password reset, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E8E8E8;">
          <p style="color: #7F8C8D; font-size: 12px;">
            Best regards,<br>
            <strong>WasteZero Team</strong>
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// API Routes

// 1. Forgot Password - Send OTP
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists (replace with your database query)
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email address'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + (10 * 60 * 1000); // 10 minutes

    // Store OTP (replace with your database)
    otpStore.set(email, {
      otp,
      expiry: otpExpiry,
      attempts: 0
    });

    // Send OTP via email
    const emailSent = await sendOTP(email, otp);
    
    if (emailSent) {
      res.json({
        success: true,
        message: 'Verification code sent successfully',
        data: {
          email,
          message: 'Check your email for the 6-digit verification code'
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send verification code. Please try again.'
      });
    }

  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// 2. Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required'
      });
    }

    // Validate OTP
    const storedOTP = otpStore.get(email);
    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: 'Verification code not found or expired'
      });
    }

    // Check if OTP has expired
    if (Date.now() > storedOTP.expiry) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.'
      });
    }

    // Check if OTP matches
    if (storedOTP.otp !== otp) {
      storedOTP.attempts += 1;
      
      // Block after 3 failed attempts
      if (storedOTP.attempts >= 3) {
        otpStore.delete(email);
        return res.status(400).json({
          success: false,
          message: 'Too many failed attempts. Please request a new verification code.'
        });
      }
      
      return res.status(400).json({
        success: false,
        message: `Invalid verification code. ${3 - storedOTP.attempts} attempts remaining.`
      });
    }

    // OTP is valid - mark as verified
    storedOTP.verified = true;
    storedOTP.verifiedAt = Date.now();

    res.json({
      success: true,
      message: 'Verification code verified successfully',
      data: {
        email,
        message: 'You can now proceed to reset your password'
      }
    });

  } catch (error) {
    console.error('Error in verify OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// 3. Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, verification code, and new password are required'
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Validate OTP
    const storedOTP = otpStore.get(email);
    if (!storedOTP || !storedOTP.verified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your verification code first'
      });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password (replace with your database update)
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
      users[userIndex].password = hashedPassword;
      users[userIndex].passwordChangedAt = Date.now();
    }

    // Remove OTP from store
    otpStore.delete(email);

    res.json({
      success: true,
      message: 'Password reset successfully',
      data: {
        email,
        message: 'You can now log in with your new password'
      }
    });

  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// 4. Resend OTP
app.post('/api/auth/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email address'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + (10 * 60 * 1000);

    // Store new OTP
    otpStore.set(email, {
      otp,
      expiry: otpExpiry,
      attempts: 0
    });

    // Send new OTP
    const emailSent = await sendOTP(email, otp);
    
    if (emailSent) {
      res.json({
        success: true,
        message: 'New verification code sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send verification code. Please try again.'
      });
    }

  } catch (error) {
    console.error('Error in resend OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// 5. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'WasteZero API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 WasteZero API server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
  console.log(`🔐 Test user: test@example.com (password: password123)`);
});

module.exports = app;
