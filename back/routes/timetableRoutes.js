const express = require('express');
const router = express.Router();
const moment = require('moment');
const Timetable = require('../models/Timetable');
const Reservation = require('../models/Reservation');

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const PERIODS = Array.from({ length: 10 }, (_, i) => `Period ${i}`); // Period 0 ~ 9

router.get('/availability', async (req, res) => {
  const { building, room, week } = req.query;
  if (!building || !room || !week) {
    return res.status(400).json({ message: 'Missing parameters' });
  }

  const startDate = moment(week);
  const availability = {};

  for (let i = 0; i < 5; i++) {
    const day = DAYS[i];
    availability[day] = {};
    PERIODS.forEach(period => availability[day][period] = 'available');
  }

  try {
    // 1수업 시간표에서 'unavailable' 표시
    const timetables = await Timetable.find({});

    timetables.forEach(dept => {
      dept.lectures.forEach(lecture => {
        const { room: lectureRoom, time, subject } = lecture;
    
        const match = lectureRoom.match(/^(.+?)\(\d+\)-(\d+)$/);
        if (!match) return;
        const lectureBuilding = match[1].trim();
        const lectureRoomNumber = match[2].trim();
    
        if (lectureBuilding !== building || lectureRoomNumber !== room) return;
    
        const timeSlots = time.split(',').map(s => s.trim());
        timeSlots.forEach(slot => {
          const m = slot.match(/(\w+)\((\d)(?: ~ (\d))?\)/);
          if (m) {
            const day = m[1];
            const startP = parseInt(m[2]);
            const endP = parseInt(m[3] || m[2]);
    
            for (let p = startP; p <= endP; p++) {
              if (availability[day] && availability[day][`Period ${p}`]) {
                availability[day][`Period ${p}`] = {
                  status: 'unavailable',
                  subject: subject
                };
              }
            }
          }
        });
      });
    });

    // 2️예약 정보로 'unavailable' 표시
    const dateRange = [];
    for (let i = 0; i < 5; i++) {
      dateRange.push(startDate.clone().add(i, 'days').format('YYYY-MM-DD'));
    }

    const reservations = await Reservation.find({
      building,
      room,
      date: { $in: dateRange }
    });

    // 시간 → Period로 매핑 (시간 기준은 08:00 ~ 17:50까지 10개)
    const hourToPeriod = {
      8: 0, 9: 1, 10: 2, 11: 3,
      12: 4, 13: 5, 14: 6, 15: 7,
      16: 8, 17: 9
    };

    reservations.forEach(r => {
      const date = moment(r.date);
      const day = DAYS[date.diff(startDate, 'days')];
      const startHour = parseInt(r.startTime.split(':')[0]);

      const period = hourToPeriod[startHour];
      if (day && period !== undefined) {
        availability[day][`Period ${period}`] = 'unavailable';
      }
    });

    res.status(200).json({
      building,
      room,
      week,
      availability
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
