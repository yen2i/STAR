// models/Timetable.js
const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  college: String,
  department: String,
  lectures: [
    {
      subject: String,
      room: String,
      time: String
    }
  ]
});

module.exports = mongoose.model('Timetable', timetableSchema);
