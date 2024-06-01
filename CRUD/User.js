const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
});

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;


// C - Create user
// R - Read User
// U - Update User
// D - Delete User
