
const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const ReservationMeta = require('../models/ReservationMeta');

// 목적 기반 인기 건물 Top 3
router.get('/popular-buildings/by-purpose', async (req, res) => {
  const { purpose } = req.query;
  if (!purpose) return res.status(400).json({ message: 'Purpose is required' });

  try {
    const result = await ReservationMeta.aggregate([
      { $match: { purpose } },
      {
        $group: {
          _id: '$building',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 대규모 인원 예약 기반 인기 건물 Top 3
router.get('/popular-buildings/by-large-group', async (req, res) => {
  try {
    const result = await ReservationMeta.aggregate([
      { $match: { peopleCount: { $gte: 30 } } },
      {
        $group: {
          _id: '$building',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    res.json(result.length ? result : { message: 'No data' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

  
module.exports = router;