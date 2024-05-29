const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Define roles
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;




// abc123 = lsiuehfrpouegrpoghewrpfohw'ifh;oirfy;[owei8gfhy;apoiwegf;oqwiegf'owiehf;oierh] = abc123
// abc123 = lsiuehfrpouegrpoghewrpfohw'ifh;oirfy;[owei8gfhy;apoiwegf;oqwiegf'owiehf;oierh]

// ouebrfouebofiwf]'][986]
//owuhfowiefno94][;339]
