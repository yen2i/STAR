const express = require('express');
const router = express.Router();

const authMiddleware = process.env.NODE_ENV === 'test'
  ? require('../middleware/fakeAuthMiddleware')
  : require('../middleware/authMiddleware');
  
const Reservation = require('../models/Reservation');
const ReservationMeta = require('../models/ReservationMeta');

const moment = require('moment'); // ⬅️ 날짜 계산용

// 시간 ➝ 교시 매핑 (예: 08:00 → Period 0)
const getPeriodsFromRange = (startTime, endTime) => {
  const periodMap = {
    8: 0, 9: 1, 10: 2, 11: 3,
    12: 4, 13: 5, 14: 6, 15: 7,
    16: 8, 17: 9
  };
  const startHour = parseInt(startTime.split(':')[0]);
  const endHour = parseInt(endTime.split(':')[0]);

  const startPeriod = periodMap[startHour];
  const endPeriod = periodMap[endHour];

  if (startPeriod === undefined || endPeriod === undefined || startPeriod >= endPeriod) return [];

  return Array.from({ length: endPeriod - startPeriod + 1 }, (_, i) => startPeriod + i);
};

router.post('/', authMiddleware, async (req, res) => {
  const { building, room, date, startTime, endTime, purpose, peopleCount } = req.body;

  if (!building || !room || !date || !startTime || !endTime) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const periods = getPeriodsFromRange(startTime, endTime);
    const dayOfWeek = moment(date).format('ddd'); // "Mon", "Tue", ...

    // 중복 예약 체크
    const overlapping = await Reservation.find({
      building,
      room,
      date,
      dayOfWeek,
      periods: { $in: periods }  // 겹치는 교시가 하나라도 있으면 탐지
    });
    if (overlapping.length > 0) {
      return res.status(409).json({ message: 'Some periods are already reserved' });
    }

    const newReservation = new Reservation({
      user: req.user.id,
      building,
      room,
      date,
      startTime,
      endTime,
      dayOfWeek,
      periods
    });

    await newReservation.save();

    const newMeta = new ReservationMeta({
      reservation: newReservation._id,
      purpose,
      peopleCount
    });
  
    await newMeta.save();

    res.status(201).json({
      message: 'Reservation completed successfully!',
      reservation: newReservation
    });

  } catch (err) {
    console.error(err);

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

  // 예약 취소 (자기 것만 삭제 가능)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const reservation = await Reservation.findById(req.params.id);
  
      // 존재하지 않는 예약
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
  
      // 다른 사용자의 예약을 지우려고 할 경우
      if (reservation.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      await Reservation.findByIdAndDelete(req.params.id);
  
      res.status(200).json({ message: 'Reservation cancelled successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  

module.exports = router;