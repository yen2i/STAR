const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  building: { type: String, required: true },      // e.g., "Frontier Hall"
  room: { type: String, required: true },          // e.g., "107"

  // 날짜 정보
  date: { type: String, required: true },          // "2024-06-01"

  // 시간블록 정보 (표에서 클릭한 칸을 기준)
  startTime: { type: String, required: true }, // e.g., "13:00"
  endTime: { type: String, required: true },   // e.g., "15:00"        // e.g., "Period 1", or "09:00~09:50"


  createdAt: {
    type: Date,
    default: Date.now
  }
});

reservationSchema.index({ building: 1, room: 1, date: 1, dayOfWeek: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('Reservation', reservationSchema);
