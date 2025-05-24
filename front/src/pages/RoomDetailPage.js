import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/RoomDetailPage.css';
import axios from 'axios';

const days = ['Monday (5/19)', 'Tuesday (5/20)', 'Wednesday (5/21)', 'Thursday (5/22)', 'Friday (5/23)'];
const dayMap = { 'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4 };
const periods = ['Period 0 (8:00 - 8:50)', 'Period 1 (9:00 - 9:50)', 'Period 2 (10:00 - 10:50)', 'Period 3 (11:00 - 11:50)'];

const defaultGrid = Array.from({ length: periods.length }, () => Array(days.length).fill(0)); // 4x5

const RoomDetailPage = () => {
  const { roomId } = useParams(); // 예: 107
  const [grid, setGrid] = useState(defaultGrid);

  const fullRoomName = `Frontier Hall(032)-${roomId}`; // "Frontier Hall(032)-107"

  useEffect(() => {
    const fetchUnavailable = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/lectures');
        const lectures = res.data.flatMap(dept => dept.lectures);

        const updated = defaultGrid.map(row => [...row]);

        lectures.forEach(lec => {
          if (!lec.room) return;

          // 여러 강의실이 공백으로 나열된 경우 처리
          const roomList = lec.room.split(' ');
          if (!roomList.includes(fullRoomName)) return;

          lec.time.split(',').forEach(timeStr => {
            const match = timeStr.trim().match(/([A-Za-z]+)\((\d+)(?:\s*~\s*(\d+))?\)/);
            if (!match) return;

            const [_, dayEng, startStr, endStr] = match;
            const dayIdx = dayMap[dayEng];
            const start = parseInt(startStr);
            const end = endStr ? parseInt(endStr) : start;

            for (let p = start; p <= end; p++) {
              const periodIdx = p - 1;
              if (periodIdx >= 0 && periodIdx < periods.length && dayIdx >= 0 && dayIdx < days.length) {
                updated[periodIdx][dayIdx] = 1; // unavailable
              }
            }
          });
        });

        setGrid(updated);
      } catch (err) {
        console.warn('⚠️ API 실패 - mock 적용');
        setGrid([
          [0, 0, 0, 0, 2],
          [0, 1, 0, 1, 2],
          [0, 0, 0, 1, 2],
          [0, 0, 0, 0, 0],
        ]);
      }
    };

    fetchUnavailable();
  }, [fullRoomName]);

  const handleClick = (r, c) => {
    if (grid[r][c] === 0) {
      const updated = grid.map((row, i) =>
        row.map((cell, j) => (i === r && j === c ? 2 : cell))
      );
      setGrid(updated);
    }
  };

  return (
    <div className="room-detail-page">
      <Header />

      <main className="room-detail-content">
        <h2>Frontier Hall - Room {roomId}</h2>
        <p className="legend">
          <span className="dot gray" /> Unavailable&nbsp;&nbsp;
          <span className="dot green" /> Available&nbsp;&nbsp;
          <span className="dot selected-dot" /> Selected
        </p>

        {/* TODO: 좌우 화살표 버튼 및 주간 스크롤 확장 시 여기에 추가 */}
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
                    {value === 2 ? '✓' : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <button className="reserve-confirm-btn">Confirm Reservation</button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RoomDetailPage;
