// models/ReservationMeta.js
const mongoose = require('mongoose');

const reservationMetaSchema = new mongoose.Schema({
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
  purpose: { type: String, required: true }, // e.g., "스터디", "동아리", "면접 준비"
  peopleCount: { type: Number, required: true }, // e.g., 5, 10, 35
});

module.exports = mongoose.model('ReservationMeta', reservationMetaSchema);
