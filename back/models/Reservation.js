const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  building: { type: String, required: true },   // e.g., "Frontier Hall"
  room: { type: String, required: true },       // e.g., "107"

  // 날짜 및 시간 정보
  date: { type: String, required: true },       // e.g., "2024-06-01"
  startTime: { type: String, required: true },  // e.g., "13:00"
  endTime: { type: String, required: true },    // e.g., "15:00"

  // 시간표 매핑용 교시 정보
  dayOfWeek: { type: String, required: true },  // e.g., "Mon", "Tue"
  periods: { type: [Number], required: true },     // e.g., 0 ~ 9

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 중복 방지 인덱스 (동일한 건물/강의실/날짜/요일/교시에는 하나만 가능)
reservationSchema.index(
  { building: 1, room: 1, date: 1, dayOfWeek: 1, periods: 1 },
  { unique: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
