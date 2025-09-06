import React, { useEffect, useState } from 'react';
import './Register.css';
import OtpPopup from './OtpPopup';

// Import particles.js properly
//import particlesJS from 'particles.js';

const API_BASE_URL = "http://localhost:5000";

const RegisterForm = () => {
  // Form input states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('');

  // OTP & verification states
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpPopup, setOtpPopup] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [verifyStatus, setVerifyStatus] = useState('');
  const [otpErrorMsg, setOtpErrorMsg] = useState('');

  // Form message (success/failure)
  const [formMessage, setFormMessage] = useState('');

  // Initialize particles.js after component mounts
  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS("particles-js", {
        particles: {
          number: { value: 25, density: { enable: true, value_area: 800 } },
          shape: {
            type: "image",
            image: {
              src: "https://img.icons8.com/emoji/48/recycling-symbol-emoji.png",
              width: 48,
              height: 48
            }
          },
          opacity: { value: 0.6, random: true },
          size: { value: 18, random: true },
          move: { enable: true, speed: 1, random: true, out_mode: "out" }
        },
        interactivity: {
          events: {
            onhover: { enable: false },
            onclick: { enable: false }
          }
        },
        retina_detect: true
      });
    } else {
      console.warn('particlesJS not found');
    }
  }, []);

  const handleVerifyEmail = async () => {
    if (!email.trim()) return alert('Please enter an email.');

    if (emailVerified) {
      alert('Email already verified.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setOtpPopup(true);
        setOtpInput('');
        setOtpErrorMsg('');
      } else {
        const error = await res.text();
        alert('Failed to send OTP: ' + error);
      }
    } catch (err) {
      alert('Error sending OTP');
      console.error(err);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput.trim()) {
      setOtpErrorMsg('Please enter the OTP.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpInput })
      });

      if (res.ok) {
        setEmailVerified(true);
        setVerifyStatus('✅ Email Verified');
        setOtpPopup(false);
      } else {
        const error = await res.text();
        setOtpErrorMsg(error || 'Invalid OTP');
      }
    } catch (err) {
      setOtpErrorMsg('Error verifying OTP');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      setFormMessage('⚠ Please verify your email first.');
      return;
    }

    if (!gender) {
      setFormMessage('⚠ Please select a gender.');
      return;
    }

    const userData = {
      username,
      email,
      password,
      role,
      skills,
      location,
      gender
    };

    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (res.status === 201) {
        setFormMessage('✅ Registered successfully! Redirecting...');
        resetForm();
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 2000);
      } else {
        const error = await res.text();
        setFormMessage(error);
      }
    } catch (err) {
      setFormMessage('Server error during registration.');
      console.error(err);
    }
  };

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('');
    setSkills('');
    setLocation('');
    setGender('');
    setEmailVerified(false);
    setVerifyStatus('');
  };

  return (
    <div className="register-page">
      <div id="particles-js"></div>

      <div className="container">
        <div className="form-container">
          <div className="header">
            <h2>Register to WasteZero</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div className="form-group email-verify-group">
              <label>Email</label>
              <div className="email-verify-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={emailVerified}
                />
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={emailVerified}
                  className={`verify-btn ${emailVerified ? 'verified' : ''}`}
                >
                  {emailVerified ? "Verified" : "Verify"}
                </button>
              </div>
              <p className="verify-status">{verifyStatus}</p>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Skills</label>
              <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <button type="submit" className="register-btn">Register</button>
          </form>

          <p className="form-message">{formMessage}</p>

          <div className="login-link">
            Already have an account? <a href="/login.html">Login</a>
          </div>
        </div>

        <div className="right-panel">
          <h3>Welcome to WasteZero</h3>
          <p>Smart Waste Pickup & Recycling Platform</p>
        </div>

        {otpPopup && (
          <OtpPopup
            otpInput={otpInput}
            setOtpInput={setOtpInput}
            onVerify={handleVerifyOtp}
            onCancel={() => setOtpPopup(false)}
            otpErrorMsg={otpErrorMsg}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
