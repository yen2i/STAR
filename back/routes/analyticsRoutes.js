
const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const ReservationMeta = require('../models/ReservationMeta');

router.get('/popular-buildings/by-purpose', async (req, res) => {
  const { purpose } = req.query;
  if (!purpose) return res.status(400).json({ message: 'Purpose is required' });

  try {
    const result = await ReservationMeta.aggregate([
      { $match: { purpose } },
      {
        $lookup: {
          from: 'reservations',
          localField: 'reservation',
          foreignField: '_id',
          as: 'reservationDetails'
        }
      },
      { $unwind: '$reservationDetails' },
      {
        $group: {
          _id: '$reservationDetails.building',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    res.json(result); // [{ _id: "Frontier Hall", count: 12 }, ...]
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/popular-buildings/by-large-group', async (req, res) => {
    try {
      const result = await ReservationMeta.aggregate([
        { $match: { peopleCount: { $gte: 30 } } },
        {
          $lookup: {
            from: 'reservations',
            localField: 'reservation',
            foreignField: '_id',
            as: 'reservationDetails'
          }
        },
        { $unwind: '$reservationDetails' },
        {
          $group: {
            _id: '$reservationDetails.building',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);
  
      res.json(result[0] || { message: 'No data' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = router;