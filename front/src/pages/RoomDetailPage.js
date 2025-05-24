import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import '../styles/RoomDetailPage.css';

const periods = [
  'Period 1 (9:00 - 9:50)',
  'Period 2 (10:00 - 10:50)',
  'Period 3 (11:00 - 11:50)',
  'Period 4 (12:00 - 12:50)',
  'Period 5 (13:00 - 13:50)',
  'Period 6 (14:00 - 14:50)',
  'Period 7 (15:00 - 15:50)',
  'Period 8 (16:00 - 16:50)',
];

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const RoomDetailPage = () => {
  const { roomId } = useParams(); // e.g. 107
  const [startOfWeek, setStartOfWeek] = useState(getStartOfWeek(new Date()));
  const [grid, setGrid] = useState(Array.from({ length: periods.length }, () => Array(dayLabels.length).fill(0)));
  const [selected, setSelected] = useState([]);

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
  };

  const fetchAvailability = async () => {
    try {
      const building = 'Frontier Hall';
      const week = formatDate(startOfWeek);

      const res = await axios.get('http://localhost:5000/api/timetable/availability', {
        params: { building, room: roomId, week },
      });

      const data = res.data.availability;
      const newGrid = Array.from({ length: periods.length }, () => Array(dayLabels.length).fill(0));

      dayLabels.forEach((day, colIdx) => {
        periods.forEach((_, rowIdx) => {
          const status = data[day][`Period ${rowIdx + 1}`];
          newGrid[rowIdx][colIdx] = status === 'unavailable' ? 1 : 0;
        });
      });

      setGrid(newGrid);
    } catch (err) {
      console.warn('⚠️ API 실패: mock 사용');
      setGrid([
        [0, 0, 0, 1, 2],
        [0, 1, 0, 1, 2],
        [0, 0, 0, 1, 2],
        [0, 0, 0, 0, 2],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ]);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [startOfWeek, roomId]);

  const handleClick = (row, col) => {
    if (grid[row][col] !== 0) return;

    // 연속된 시간만 허용
    const key = `${row}-${col}`;
    if (selected.length === 0) {
      setSelected([key]);
      return;
    }

    const [lastRow, lastCol] = selected[selected.length - 1].split('-').map(Number);
    if (col === lastCol && row === lastRow + 1) {
      setSelected([...selected, key]);
    } else {
      alert('Please select continuous time slots.');
    }
  };

  const getCellClass = (r, c) => {
    if (grid[r][c] === 1) return 'cell unavailable';
    const key = `${r}-${c}`;
    return selected.includes(key) ? 'cell selected' : 'cell available';
  };

  const getWeekDates = () => {
    return [...Array(5)].map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return `${dayLabels[i]} (${d.getMonth() + 1}/${d.getDate()})`;
    });
  };

  const makeReservation = () => {
    if (selected.length === 0) {
      alert('Please select at least one slot.');
      return;
    }
    // TODO: 실제 예약 API 호출 예정
    alert(`Reserved ${selected.length} slots!`);
  };

  return (
    <div className="room-detail-page">
      <Header />
      <main className="room-detail-content">
        <div className="calendar-header">
          <button onClick={() => moveWeek(-1)}>&larr;</button>
          <h2>Room {roomId} - Week of {formatDate(startOfWeek)}</h2>
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
              <div key={i} className="cell header">{d}</div>
            ))}
          </div>

          {periods.map((label, r) => (
            <div className="grid-row" key={r}>
              <div className="cell time-label">{label}</div>
              {dayLabels.map((_, c) => (
                <div
                  key={c}
                  className={getCellClass(r, c)}
                  onClick={() => handleClick(r, c)}
                >
                  {selected.includes(`${r}-${c}`) ? '✓' : ''}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="calendar-actions">
          <button className="reserve-btn" onClick={makeReservation}>Make a Reservation →</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RoomDetailPage;
