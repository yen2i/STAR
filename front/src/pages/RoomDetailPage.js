// RoomDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
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

const RoomDetailPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [startOfWeek, setStartOfWeek] = useState(getStartOfWeek(new Date()));
  const [grid, setGrid] = useState(Array.from({ length: periods.length }, () => Array(dayLabels.length).fill(0)));
  const [selected, setSelected] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const building = "Frontier Hall";
  const room = roomId;

  const formatDate = (date) => date.toISOString().split('T')[0];

  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  const moveWeek = (offset) => {
    const next = new Date(startOfWeek);
    next.setDate(next.getDate() + offset * 7);
    setStartOfWeek(next);
    setSelected([]);
  };

  const getWeekDates = () => {
    return [...Array(5)].map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return `${dayKor[i]} (${d.getMonth() + 1}/${d.getDate()})`;
    });
  };

  const getDateByCol = (col) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + col);
    return formatDate(d);
  };

  const handleClick = (row, col) => {
    if (grid[row][col] !== 0) return;
    const key = `${row}-${col}`;
    const isAdjacent = selected.length === 0 || selected.some(k => {
      const [r, c] = k.split('-').map(Number);
      return r === row - 1 && c === col || r === row + 1 && c === col;
    });
    if (!isAdjacent) return alert('Select contiguous time slots only.');
    const updated = selected.includes(key)
      ? selected.filter(k => k !== key)
      : [...selected, key];
    setSelected(updated);
  };

  const getCellClass = (r, c) => {
    if (grid[r][c] === 1) return 'cell unavailable';
    const key = `${r}-${c}`;
    return selected.includes(key) ? 'cell selected' : 'cell available';
  };

  const fetchAvailability = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/timetable/availability', {
        params: {
          building,
          room,
          week: formatDate(startOfWeek)
        }
      });

      const newGrid = grid.map(row => [...row]);
      dayLabels.forEach((day, c) => {
        periods.forEach((_, r) => {
          const status = res.data.availability[day]?.[`Period ${r}`];
          newGrid[r][c] = status === 'unavailable' ? 1 : 0;
        });
      });
      setGrid(newGrid);
    } catch (err) {
      console.warn('⚠️ API failed. Using mock.');
      setGrid([
        [0, 0, 1, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ]);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [startOfWeek]);

  const handleReservation = async () => {
    if (selected.length === 0) return alert('Please select at least one slot.');
    const [r, c] = selected[0].split('-').map(Number);
    const date = getDateByCol(c);
    const startTime = startTimes[r];
    const endTime = startTimes[r + selected.length] || '18:00';

    try {
      await axios.post('http://localhost:5000/api/reservation', {
        building,
        room,
        date,
        startTime,
        endTime
      }, { withCredentials: true });
      setShowConfirm(false);
      setShowSuccess(true);
    } catch (err) {
      alert('Reservation failed.');
    }
  };

  return (
    <div className="room-detail-page">
      <Header />
      <main className="room-detail-content">
        <div className="calendar-header">
          <button onClick={() => moveWeek(-1)}>&larr;</button>
          <h2>Room {room} - Week of {formatDate(startOfWeek)}</h2>
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
            {getWeekDates().map((d, i) => (
              <div className="cell header" key={i}>{d}</div>
            ))}
          </div>

          {periods.map((label, r) => (
            <div className="grid-row" key={r}>
              <div className="cell time-label">{label}</div>
              {dayLabels.map((_, c) => (
                <div key={c} className={getCellClass(r, c)} onClick={() => handleClick(r, c)}>
                  {selected.includes(`${r}-${c}`) ? '✓' : ''}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="calendar-actions">
          <button className="reserve-btn" onClick={() => setShowConfirm(true)}>Make a Reservation →</button>
        </div>

        {showConfirm && (
          <div className="modal">
            <div className="modal-box">
              <h3>{building}</h3>
              <p>Room {room}</p>
              <p>- {getDateByCol(parseInt(selected[0]?.split('-')[1]))}</p>
              <p>Are you sure to confirm your reservation?</p>
              <button onClick={handleReservation}>Yes</button>
              <button onClick={() => setShowConfirm(false)}>No</button>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="modal">
            <div className="modal-box">
              <h3>Reservation completed successfully!</h3>
              <button onClick={() => navigate('/my-reservations')}>Check Reservation</button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RoomDetailPage;