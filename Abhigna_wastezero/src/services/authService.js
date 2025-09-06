import axios from 'axios';

// Configure axios defaults
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authService = {
  // Forgot password - send OTP
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify OTP and reset password
  verifyOTPAndResetPassword: async (email, otp, newPassword) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        email,
        otp,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Resend OTP
  resendOTP: async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/resend-otp`, {
        email
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
