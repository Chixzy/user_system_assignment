const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {type: String, unique: true},
    password: {type: String},
    phone: Number,
    gender: String ,
    token: String
}, {collection: 'users'});

const model = mongoose.model('User', userSchema);

module.exports = model;