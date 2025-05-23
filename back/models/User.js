// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  studentNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  major: { type: String, required: true },
  favorites: [{ type: String }] // 건물명들
});

module.exports = mongoose.model('User', userSchema);
