// models/ReservationMeta.js
const mongoose = require('mongoose');

const reservationMetaSchema = new mongoose.Schema({
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
  building: { type: String, required: true },
  purpose: { type: String, required: true },
  peopleCount: { type: Number, required: true },
});

module.exports = mongoose.model('ReservationMeta', reservationMetaSchema);
