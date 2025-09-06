const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['NGO','Volunteer','Admin'],
        default: 'Volunteer'
    },
    skills:{
        type: [String],
        default: []
    },
    location:{
        type: String,
        default: ''
    },
    bio:{
        type: String,
        default: ''
    }
}, { timestamps: true });   
module.exports = mongoose.model('User', userSchema);