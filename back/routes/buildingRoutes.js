const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');

// [GET] 건물 목록 (번호 포함)
router.get('/', async (req, res) => {
  try {
    const timetables = await Timetable.find({});
    const buildingMap = new Map(); // key: buildingNo, value: buildingName

    timetables.forEach(dept => {
      dept.lectures.forEach(lecture => {
        const room = lecture.room; // e.g., "Frontier Hall(032)-105"
        const match = room.match(/^(.+)\((\d+)\)-/); // 추출

        if (match) {
          const buildingName = match[1].trim();       // "Frontier Hall"
          const buildingNo = parseInt(match[2]);       // "032" → 32
          buildingMap.set(buildingNo, buildingName);
        }
      });
    });

    // Map → Array로 변환
    const buildings = Array.from(buildingMap.entries())
      .map(([no, name]) => ({ buildingNo: no, buildingName: name }))
      .sort((a, b) => a.buildingNo - b.buildingNo);

    res.status(200).json({ buildings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch buildings' });
  }
});

// [GET] 특정 건물 번호의 강의실 목록
router.get('/rooms', async (req, res) => {
  const { buildingNo } = req.query;
  if (!buildingNo) return res.status(400).json({ message: 'Missing buildingNo' });

  try {
    const regex = new RegExp(`\\(${String(buildingNo).padStart(3, '0')}\\)-`);

    const timetables = await Timetable.find({ 'lectures.room': { $regex: regex } });

    const roomSet = new Set();

    timetables.forEach(dept => {
      dept.lectures.forEach(lecture => {
        const match = lecture.room.match(/\((\d+)\)-(\d+)/);
        if (match && match[1] === String(buildingNo).padStart(3, '0')) {
          roomSet.add(match[2]); // e.g., "105"
        }
      });
    });

    const rooms = Array.from(roomSet).sort();
    res.status(200).json({ buildingNo, rooms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch rooms' });
  }
});

module.exports = router;
