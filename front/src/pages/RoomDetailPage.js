import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import '../styles/RoomDetailPage.css';

const periods = [
  'Period 0 (8:00 - 8:50)',
  'Period 1 (9:00 - 9:50)',
  'Period 2 (10:00 - 10:50)',
  'Period 3 (11:00 - 11:50)',
  'Period 4 (12:00 - 12:50)',
  'Period 5 (13:00 - 13:50)',
  'Period 6 (14:00 - 14:50)',
  'Period 7 (15:00 - 15:50)',
  'Period 8 (16:00 - 16:50)',
  'Period 9 (17:00 - 17:50)',
];

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const dayKor = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const startTimes = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const MOCK_AVAILABILITY = {
  Mon: { 'Period 0': 'unavailable', 'Period 1': 'unavailable' },
  Tue: { 'Period 2': 'unavailable' },
  Wed: {},
  Thu: {},
  Fri: {},
};

const MOCK_TIMETABLE = [
  { room: 'Frontier Hall(107)', time: 'Mon(0 ~ 1)', subject: 'Data Mining' },
  { room: 'Frontier Hall(107)', time: 'Tue(2 ~ 2)', subject: 'Web Programming' },
];

const RoomDetailPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [startOfWeek, setStartOfWeek] = useState(getStartOfWeek(new Date()));
  const [grid, setGrid] = useState(Array.from({ length: periods.length }, () => Array(dayLabels.length).fill(0)));
  const [selected, setSelected] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timetable, setTimetable] = useState([]);

  const building = 'Frontier Hall';
  const room = roomId;

  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  const formatDate = (date) => date.toISOString().split('T')[0];

  const moveWeek = (offset) => {
    const next = new Date(startOfWeek);
    next.setDate(next.getDate() + offset * 7);
    setStartOfWeek(next);
    setSelected([]);
  };

  const getWeekDates = () => [...Array(5)].map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return `${dayKor[i]} (${d.getMonth() + 1}/${d.getDate()})`;
  });

  const getDateByCol = (col) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + col);
    return formatDate(d);
  };

  const handleClick = (row, col) => {
    const key = `${row}-${col}`;
    if (grid[row][col] === 1) return;
    if (selected.includes(key)) {
      setSelected(selected.filter(k => k !== key));
    } else {
      const isAdjacent = selected.length === 0 || selected.some(k => {
        const [r, c] = k.split('-').map(Number);
        return (r === row - 1 && c === col) || (r === row + 1 && c === col);
      });
      if (!isAdjacent) return alert('Select contiguous time slots only.');
      setSelected([...selected, key]);
    }
  };

  const fetchAvailability = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/timetable/availability', {
        params: { building, room, week: formatDate(startOfWeek) }
      });
      applyGridFromAvailability(res.data.availability);
    } catch (err) {
      console.warn('⚠️ API failed, using mock availability');
      applyGridFromAvailability(MOCK_AVAILABILITY);
    }
  };

  const fetchTimetable = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/timetable');
      setTimetable(res.data);
    } catch (err) {
      console.warn('⚠️ Timetable API failed, using mock');
      setTimetable(MOCK_TIMETABLE);
    }
  };

  const applyGridFromAvailability = (data) => {
    const newGrid = grid.map(row => [...row]);
    dayLabels.forEach((day, c) => {
      periods.forEach((_, r) => {
        const status = data[day]?.[`Period ${r}`];
        newGrid[r][c] = status === 'unavailable' ? 1 : 0;
      });
    });
    setGrid(newGrid);
  };

  useEffect(() => {
    fetchAvailability();
    fetchTimetable();
  }, [startOfWeek]);

  const findLectureTitle = (room, day, period) => {
    return (
      timetable.find(
        (lec) => lec.room?.includes(room) && lec.time?.includes(day) && lec.time?.match(/\d+/g)?.includes(String(period))
      )?.subject || ''
    );
  };

  const renderCell = (r, c) => {
    const key = `${r}-${c}`;
    const isUnavailable = grid[r][c] === 1;
    const isSelected = selected.includes(key);
    const dayLabel = dayLabels[c];
    const title = isUnavailable ? findLectureTitle(room, dayLabel, r) : '';

    return (
      <div
        key={c}
        className={`cell ${isUnavailable ? 'unavailable' : isSelected ? 'selected' : 'available'}`}
        onClick={() => !isUnavailable && handleClick(r, c)}
      >
        {isUnavailable ? title : isSelected ? '✓' : ''}
      </div>
    );
  };

  const handleReservation = async () => {
    if (selected.length === 0) return alert('Please select at least one slot.');
    const [r, c] = selected[0].split('-').map(Number);
    const date = getDateByCol(c);
    const startTime = startTimes[r];
    const endTime = startTimes[r + selected.length] || '18:00';

    try {
      await axios.post(
        'http://localhost:5000/api/reservations',
        { building, room, date, startTime, endTime },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setShowConfirm(false);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setShowConfirm(false);
      setShowSuccess(true);
    }
  };

  return (
    <div className="room-detail-page">
      <Header />
      <main className="room-detail-content">
        <div className="calendar-header">
          <button onClick={() => moveWeek(-1)}>&larr;</button>
          <h2>{building} - Room {room} - Week of {formatDate(startOfWeek)}</h2>
          <button onClick={() => moveWeek(1)}>&rarr;</button>
        </div>

        <div className="legend">
          <span className="dot gray" /> Unavailable
          <span className="dot green" /> Available
          <span className="dot dark-green" /> Selected
        </div>

        <div className="grid">
          <div className="grid-header">
            <div className="cell time-label"></div>
            {getWeekDates().map((d, i) => <div className="cell header" key={i}>{d}</div>)}
          </div>
          {periods.map((label, r) => (
            <div className="grid-row" key={r}>
              <div className="cell time-label">{label}</div>
              {dayLabels.map((_, c) => renderCell(r, c))}
            </div>
          ))}
        </div>

        <div className="calendar-actions">
          <button className="reserve-btn" onClick={() => setShowConfirm(true)}>Make a Reservation →</button>
        </div>

        {showConfirm && selected.length > 0 && (
          <Modal onClose={() => setShowConfirm(false)} size="medium">
            <h3>{building}</h3>
            <p>Room {room}</p>
            {(() => {
              const [firstRow, firstCol] = selected[0].split('-').map(Number);
              const lastRow = firstRow + selected.length - 1;
              const day = dayKor[firstCol];
              const timeRange = `${startTimes[firstRow]} - ${startTimes[lastRow + 1] || '18:00'}`;
              return <p>- {day} / Period {firstRow} - {lastRow} ({timeRange})</p>;
            })()}
            <p>Are you sure to confirm your reservation?</p>
            <div className="modal-buttons">
              <button onClick={handleReservation}>Yes</button>
              <button onClick={() => setShowConfirm(false)}>No</button>
            </div>
          </Modal>
        )}

        {showSuccess && (
          <Modal onClose={() => setShowSuccess(false)} size="medium">
            <h3>Reservation completed successfully!</h3>
            <button onClick={() => navigate('/my-reservation')}>Check Reservation</button>
          </Modal>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RoomDetailPage;
