const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Reservation = require('../models/Reservation');

// ✅ 예약 생성 (startTime, endTime 겹침 체크 포함)
router.post('/', authMiddleware, async (req, res) => {
  const { building, room, date, startTime, endTime } = req.body;

  // 필수값 확인
  if (!building || !room || !date || !startTime || !endTime) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // ✅ 중복 예약 체크 (시간 겹침 여부 확인)
    const overlapping = await Reservation.findOne({
      building,
      room,
      date,
      $expr: {
        $and: [
          { $lt: ["$startTime", endTime] },
          { $gt: ["$endTime", startTime] }
        ]
      }
    });

    if (overlapping) {
      return res.status(409).json({ message: 'This time already reserved' });
    }

    // ✅ 예약 저장
    const newReservation = new Reservation({
      user: req.user.id,
      building,
      room,
      date,
      startTime,
      endTime
    });

    await newReservation.save();

    res.status(201).json({
      message: 'Reservation successful',
      reservation: newReservation
    });

  } catch (err) {
    console.error(err);

    // MongoDB unique index 충돌로 인한 중복
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Time slot already reserved (conflict)' });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

// 예약 목록 조회: 현재 로그인한 사용자의 예약만 반환
router.get('/my', authMiddleware, async (req, res) => {
    try {
      const reservations = await Reservation.find({ user: req.user.id }).sort({ date: 1 });
      res.status(200).json(reservations);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;