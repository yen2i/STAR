import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/RoomDetailPage.css';
import axios from 'axios';
import leftArrow from '../assets/leftarrow.png';
import rightArrow from '../assets/rightarrow.png';

const days = ['Monday (5/19)', 'Tuesday (5/20)', 'Wednesday (5/21)', 'Thursday (5/22)', 'Friday (5/23)'];
const periods = ['Period 0 (8:00 - 8:50)', 'Period 1 (9:00 - 9:50)', 'Period 2 (10:00 - 10:50)', 'Period 3 (11:00 - 11:50)'];

const defaultGrid = Array.from({ length: periods.length }, () => Array(days.length).fill(0));

const RoomDetailPage = () => {
  const [grid, setGrid] = useState(defaultGrid);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchUnavailable = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/lectures');
        const lectures = res.data.flatMap(dept => dept.lectures);

        const updated = defaultGrid.map(row => [...row]);

        lectures.forEach(lec => {
          if (!lec.room.includes('프론티어관-107')) return;
          lec.time.split(',').forEach(timeStr => {
            const match = timeStr.match(/([가-힣]+)\((\d+)(?:\s*~\s*(\d+))?\)/);
            if (!match) return;

            const [_, dayKor, startStr, endStr] = match;
            const dayIdx = { '월': 0, '화': 1, '수': 2, '목': 3, '금': 4 }[dayKor];
            const start = parseInt(startStr);
            const end = endStr ? parseInt(endStr) : start;

            for (let p = start; p <= end; p++) {
              const periodIdx = p - 1;
              if (periodIdx >= 0 && periodIdx < periods.length && dayIdx >= 0 && dayIdx < days.length) {
                updated[periodIdx][dayIdx] = 1;
              }
            }
          });
        });

        setGrid(updated);
      } catch (err) {
        console.warn('⚠️ API 실패 - mock 적용');
        const mock = defaultGrid.map(row => [...row]);
        mock[1][0] = 1;
        mock[0][4] = 2;
        setGrid(mock);
        setSelectedSlot({ row: 0, col: 4 });
      }
    };

    fetchUnavailable();
  }, []);

  const handleClick = (r, c) => {
    if (grid[r][c] === 0) {
      const updated = grid.map((row, i) =>
        row.map((cell, j) => (i === r && j === c ? 2 : cell === 2 ? 0 : cell))
      );
      setGrid(updated);
      setSelectedSlot({ row: r, col: c });
    }
  };

  const handleReserve = () => {
    if (!selectedSlot) return alert('Please select a time slot.');
    const { row, col } = selectedSlot;
    alert(`예약 요청: ${days[col]} - ${periods[row]}`);
    // 예약 API 호출 로직 위치
  };

  return (
    <div className="room-detail-page">
      <Header />

      <main className="room-detail-content">
        <div className="week-nav">
          <img src={leftArrow} alt="Previous Week" className="arrow" />
          <h2>Frontier Hall - Room 107</h2>
          <img src={rightArrow} alt="Next Week" className="arrow" />
        </div>

        <p className="legend">
          <span className="dot gray" /> Unavailable&nbsp;&nbsp;
          <span className="dot green" /> Available&nbsp;&nbsp;
          <span className="dot blue" /> Selected
        </p>

        <div className="grid">
          <div className="grid-header">
            <div className="cell time-label"></div>
            {days.map((day, i) => (
              <div key={i} className="cell header">{day}</div>
            ))}
          </div>

          {periods.map((period, rowIdx) => (
            <div className="grid-row" key={rowIdx}>
              <div className="cell time-label">{period}</div>
              {days.map((_, colIdx) => {
                const value = grid[rowIdx][colIdx];
                const className =
                  value === 0 ? 'cell available' :
                  value === 1 ? 'cell unavailable' :
                  'cell selected';
                return (
                  <div
                    key={colIdx}
                    className={className}
                    onClick={() => handleClick(rowIdx, colIdx)}
                  >
                    {value === 2 ? '✔' : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <button className="reserve-confirm-button" onClick={handleReserve}>Confirm Reservation</button>
      </main>

      <Footer />
    </div>
  );
};

export default RoomDetailPage;