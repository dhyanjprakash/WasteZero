
const jwt = require('jsonwebtoken');

const generateToken = (user,rememberMe) => {
    console.log("Generating token with rememberMe:", rememberMe);
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: rememberMe ? '7d' : '1d' }
  );
}
module.exports = {  generateToken };