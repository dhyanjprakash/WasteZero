import React from 'react';

const OtpPopup = ({ otpInput, setOtpInput, onVerify, onCancel, otpErrorMsg }) => {
  return (
    <div className="otp-popup-overlay">
      <div className="otp-popup">
        <h4>Verify Your Email</h4>
        <p>An OTP has been sent. Please enter it below:</p>
        <input
          type="text"
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
        />
        <div className="otp-btns">
          <button className="btn-verify" onClick={onVerify}>Verify</button>
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
        </div>
        {otpErrorMsg && <p className="otp-error-msg">{otpErrorMsg}</p>}
      </div>
    </div>
  );
};

export default OtpPopup;
