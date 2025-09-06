import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState('email'); // email, otp, newPassword, success
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [verifiedOtp, setVerifiedOtp] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const email = watch('email');
  const otp = watch('otp');
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  // Step 1: Send OTP to email
  const handleSendOTP = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/forgot-password', {
        email: data.email
      });
      
      if (response.data.success) {
        setUserEmail(data.email);
        setCurrentStep('otp');
        setOtpExpiry(Date.now() + (10 * 60 * 1000)); // 10 minutes
        toast.success('OTP sent to your email!');
        reset();
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/verify-otp', {
        email: userEmail,
        otp: data.otp
      });
      
      if (response.data.success) {
  setVerifiedOtp(data.otp); // Store the verified OTP
        setCurrentStep('newPassword');
        toast.success('OTP verified successfully!');
        reset();
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/reset-password', {
        email: userEmail,
        otp: verifiedOtp,
        newPassword: data.newPassword
      });
      
      if (response.data.success) {
        setCurrentStep('success');
        toast.success('Password reset successfully!');
        reset();
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/resend-otp', {
        email: userEmail
      });
      
      if (response.data.success) {
        setOtpExpiry(Date.now() + (10 * 60 * 1000));
        toast.success('New OTP sent!');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to previous step
  const handleGoBack = () => {
    if (currentStep === 'otp') {
      setCurrentStep('email');
      setUserEmail('');
    } else if (currentStep === 'newPassword') {
      setCurrentStep('otp');
    }
    reset();
  };

  // Calculate remaining time for OTP
  const getRemainingTime = () => {
    if (!otpExpiry) return '';
    const remaining = Math.max(0, otpExpiry - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Start countdown timer
  React.useEffect(() => {
    if (otpExpiry && currentStep === 'otp') {
      const timer = setInterval(() => {
        if (Date.now() >= otpExpiry) {
          setOtpExpiry(null);
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpExpiry, currentStep]);

  const handleBackToLogin = () => {
    setCurrentStep('email');
    setUserEmail('');
    reset();
  };

  return (
    <div className="forgot-password-container">
      {/* Left Panel - Green Background */}
      <div className="left-panel">
        <div className="left-content">
          <div className="logo-container">
            {/* ZERO WASTE Logo - PNG Image */}
            <img 
              src="/zero-waste-logo.png" 
              alt="ZERO WASTE Logo" 
              className="zero-waste-logo-image"
              width="100"
              height="100"
            />
          </div>
          <h1 className="welcome-title">Welcome back to WasteZero!</h1>
          <p className="welcome-subtitle">Smart Waste Pickup & Recycling Platform</p>
        </div>
      </div>

      {/* Right Panel - White Background with Form */}
      <div className="right-panel">
        <div className="form-container">
          {/* Step 1: Email Input */}
          {currentStep === 'email' && (
            <>
              <h2 className="form-title">Reset your password</h2>
              <p className="form-description">
                Enter your email address and we'll send you a verification code
              </p>

              <form onSubmit={handleSubmit(handleSendOTP)} className="reset-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={isLoading || !email}
                >
                  {isLoading ? 'Sending...' : 'Send verification code'}
                </button>
              </form>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {currentStep === 'otp' && (
            <>
              <h2 className="form-title">Enter verification code</h2>
              <p className="form-description">
                We've sent a 6-digit code to {userEmail}
              </p>

              <form onSubmit={handleSubmit(handleVerifyOTP)} className="reset-form">
                <div className="form-group">
                  <label htmlFor="otp" className="form-label">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    className={`form-input ${errors.otp ? 'error' : ''}`}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    {...register('otp', {
                      required: 'Verification code is required',
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: 'Please enter a 6-digit code'
                      }
                    })}
                  />
                  {errors.otp && (
                    <span className="error-message">{errors.otp.message}</span>
                  )}
                </div>

                {otpExpiry && (
                  <div className="otp-timer">
                    <span>Code expires in: {getRemainingTime()}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="submit-button"
                  disabled={isLoading || !otp || !otpExpiry}
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>

                <div className="otp-actions">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="resend-button"
                    disabled={isLoading || otpExpiry}
                  >
                    Resend code
                  </button>
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="back-button"
                  >
                    ← Back
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Step 3: New Password */}
          {currentStep === 'newPassword' && (
            <>
              <h2 className="form-title">Create new password</h2>
              <p className="form-description">
                Your password must be at least 8 characters long
              </p>

              <form onSubmit={handleSubmit(handleResetPassword)} className="reset-form">
                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className={`form-input ${errors.newPassword ? 'error' : ''}`}
                    placeholder="Enter new password"
                    {...register('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
                      }
                    })}
                  />
                  {errors.newPassword && (
                    <span className="error-message">{errors.newPassword.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm new password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === newPassword || 'Passwords do not match'
                    })}
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={isLoading || !newPassword || !confirmPassword}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>

                <button
                  type="button"
                  onClick={handleGoBack}
                  className="back-button"
                >
                  ← Back
                </button>
              </form>
            </>
          )}

          {/* Step 4: Success */}
          {currentStep === 'success' && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Password reset successfully!</h3>
              <p>You can now log in with your new password</p>
              <button
                onClick={handleBackToLogin}
                className="submit-button"
              >
                Continue to Login
              </button>
            </div>
          )}

          {/* Back to Login Link */}
          {currentStep === 'email' && (
            <button
              onClick={handleBackToLogin}
              className="back-to-login"
            >
              ← Back to login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
