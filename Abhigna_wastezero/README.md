# 🚀 WasteZero - Complete Forgot Password OTP System

A comprehensive forgot password solution built with **React** frontend and **Node.js/Express** backend, featuring **email OTP verification** for secure password reset functionality.

## ✨ **Features**

### **Frontend (React)**
- 🎨 **Beautiful UI** - Modern, responsive design with ZERO WASTE branding
- 📱 **Multi-step Flow** - Email → OTP → New Password → Success
- 🔐 **Form Validation** - Real-time validation with react-hook-form
- ⏰ **OTP Timer** - 10-minute countdown with expiry handling
- 🔄 **Resend OTP** - Ability to request new verification codes
- 📧 **Email Integration** - Seamless backend API communication
- 🎯 **User Experience** - Intuitive navigation between steps

### **Backend (Node.js/Express)**
- 📧 **Email Service** - Professional HTML email templates with Nodemailer
- 🔐 **OTP Generation** - Secure 6-digit verification codes
- ⏰ **Expiry Management** - Automatic OTP expiration after 10 minutes
- 🛡️ **Security Features** - Rate limiting, attempt tracking, password hashing
- 🔄 **Resend Functionality** - Generate and send new OTPs
- 📊 **API Endpoints** - RESTful API with proper error handling

## 🏗️ **Project Structure**

```
wastezero-forgot-password/
├── src/                          # React Frontend
│   ├── components/
│   │   ├── ForgotPassword.js     # Main component with OTP flow
│   │   └── ForgotPassword.css    # Component styling
│   ├── services/
│   │   └── authService.js        # API service functions
│   ├── App.js                    # Main app component
│   └── index.js                  # React entry point
├── backend/                      # Node.js Backend
│   ├── server.js                 # Express server with OTP APIs
│   ├── package.json              # Backend dependencies
│   └── env.example              # Environment variables
├── public/                       # Static assets
│   ├── zero-waste-logo.png      # Your logo file
│   └── index.html               # HTML template
└── README.md                     # This file
```

## 🚀 **Quick Start**

### **1. Frontend Setup**
```bash
# Install dependencies
npm install

# Start development server
npm start
```

### **2. Backend Setup**
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env
# Edit .env with your email credentials

# Start backend server
npm run dev
```

### **3. Access Your Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔧 **Configuration**

### **Email Setup (Required for OTP)**
1. **Gmail Account**: Use a Gmail account for sending emails
2. **App Password**: Generate an app password (don't use your main password)
3. **Environment Variables**: Update `backend/.env`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

### **Frontend API Configuration**
Update `src/services/authService.js` with your backend URL:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 📱 **User Flow**

### **Step 1: Email Input**
- User enters email address
- Form validation ensures proper email format
- Backend checks if user exists
- OTP is generated and sent via email

### **Step 2: OTP Verification**
- User receives 6-digit code via email
- 10-minute countdown timer starts
- Option to resend OTP if needed
- Maximum 3 failed attempts allowed

### **Step 3: New Password**
- User creates new password (min 8 characters)
- Password confirmation required
- Backend validates and hashes new password

### **Step 4: Success**
- Password reset confirmation
- Option to return to login page

## 🔌 **API Endpoints**

### **1. Send OTP**
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### **2. Verify OTP**
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

### **3. Reset Password**
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```

### **4. Resend OTP**
```http
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

## 🎨 **Customization**

### **Logo**
- Replace `public/zero-waste-logo.png` with your logo
- Supported formats: PNG, JPG, SVG
- Recommended size: 100x100 pixels

### **Colors**
- Primary: `#2ECC71` (Green)
- Secondary: `#27AE60` (Dark Green)
- Text: `#2C3E50` (Dark)
- Accent: `#7F8C8D` (Gray)

### **Styling**
- All styles are in `src/components/ForgotPassword.css`
- Responsive breakpoints: 768px, 480px
- Hover effects and animations included

## 🛡️ **Security Features**

- **OTP Expiry**: 10-minute automatic expiration
- **Rate Limiting**: Maximum 3 failed OTP attempts
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Frontend and backend validation
- **CORS Protection**: Configured for development/production
- **Error Handling**: Secure error messages

## 📧 **Email Template**

The system sends professional HTML emails with:
- WasteZero branding
- Clear verification code display
- Expiry warnings
- Security notices
- Professional styling

## 🧪 **Testing**

### **Test User**
- **Email**: `test@example.com`
- **Password**: `password123`

### **Test Flow**
1. Enter test email in forgot password form
2. Check console for OTP (in development)
3. Complete the password reset flow
4. Verify new password works

## 🚀 **Deployment**

### **Frontend (React)**
```bash
# Build for production
npm run build

# Deploy build folder to your hosting service
```

### **Backend (Node.js)**
```bash
# Set NODE_ENV=production
# Update environment variables
# Use PM2 or similar for process management
npm start
```

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Email not sending**
   - Check Gmail app password
   - Verify environment variables
   - Check Gmail security settings

2. **CORS errors**
   - Ensure backend is running on port 5000
   - Check CORS configuration in backend

3. **OTP not working**
   - Check email delivery
   - Verify OTP storage in backend
   - Check console for errors

### **Debug Mode**
```bash
# Backend
NODE_ENV=development npm run dev

# Frontend
# Check browser console for API calls
```

## 📚 **Dependencies**

### **Frontend**
- React 18.2.0
- react-hook-form 7.48.2
- axios 1.6.0
- react-hot-toast 2.4.1

### **Backend**
- Express 4.18.2
- Nodemailer 6.9.7
- bcrypt 5.1.1
- CORS 2.8.5

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For support or questions:
- Check the troubleshooting section
- Review API documentation
- Open an issue in the repository

---

