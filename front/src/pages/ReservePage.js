import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import '../styles/ReservePage.css';
import filledStar from '../assets/icons/star-filled.png';
import emptyStar from '../assets/icons/star-empty.png';

// ✅ 이미지 경로 자동 매핑 함수
const getBuildingImage = (id) => {
  try {
    return require(`../assets/buildings img/${id}.png`);
  } catch {
    return require(`../assets/buildings img/2.png`);
  }
};

const ReservePage = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavoriteIds(stored);
  }, []);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/buildings'); // ✅ 전체 건물 리스트
        const buildingData = res.data.buildings;

        const buildingList = await Promise.all(
          buildingData.map(async (b) => {
            const roomRes = await axios.get(`http://localhost:5000/api/buildings/rooms?buildingNo=${b.buildingNo}`);
            const availableRooms = roomRes.data.rooms || [];

            return {
              id: String(b.buildingNo),
              name: b.buildingName,
              image: getBuildingImage(b.buildingNo),
              availableRooms: availableRooms.map(room => ({
                room: `Room ${room}`,
                time: '8:00 - 17:50'
              }))
            };
          })
        );

        setBuildings(buildingList);
      } catch (err) {
        console.warn('⚠️ API 실패 - mock 데이터 사용');
        setBuildings([
          {
            id: '32',
            name: 'Frontier Hall',
            image: getBuildingImage('32'),
            availableRooms: [
              { room: 'Room 107', time: '8:00 - 10:50' },
              { room: 'Room 131', time: '11:00 - 12:50' },
            ],
          },
          {
            id: '2',
            name: 'Dasan Hall',
            image: getBuildingImage('2'),
            availableRooms: [
              { room: 'Room 201', time: '9:00 - 9:50' },
              { room: 'Room 105', time: '10:00 - 10:50' },
            ],
          },
        ]);
      }
    };

    fetchBuildings();
  }, []);

  const toggleFavorite = (id) => {
    const updated = favoriteIds.includes(id)
      ? favoriteIds.filter((fid) => fid !== id)
      : [...favoriteIds, id];
    setFavoriteIds(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const openRoomModal = (building) => {
    setSelectedBuilding(building);
    setShowModal(true);
  };

  const handleRoomSelect = (room) => {
    setShowModal(false);
    const roomNumber = room.room.match(/\d+/)?.[0];
    navigate(`/reserve/${roomNumber}`);
  };

  const favoriteBuildings = buildings.filter(b => favoriteIds.includes(b.id));
  const nonFavoriteBuildings = buildings.filter(b => !favoriteIds.includes(b.id));

  const renderBuildingCard = (building) => (
    <div className="building-card" key={building.id}>
      <img src={building.image} alt={building.name} className="building-img" />
      <div className="building-info">
        <div className="building-number">No. {building.id}</div>
        <div className="building-name">{building.name}</div>
        <div className="available-count">
          🟢 Available Rooms ({building.availableRooms.length})
        </div>
      </div>
      <button className="reserve-btn" onClick={() => openRoomModal(building)}>Reserve Now →</button>
      <img
        src={favoriteIds.includes(building.id) ? filledStar : emptyStar}
        alt="favorite"
        className="star-icon"
        onClick={() => toggleFavorite(building.id)}
      />
    </div>
  );

  return (
    <div className="reserve-page">
      <Header />
      <main className="reserve-content">
        <div className="search-bar">
          <input type="text" placeholder="Search a Classroom" />
        </div>

        {favoriteBuildings.length > 0 && (
          <section>
            <h3>Favorite Classrooms</h3>
            <div className="building-list">
              {favoriteBuildings.map(renderBuildingCard)}
            </div>
          </section>
        )}

        <section>
          <h3>Buildings</h3>
          <div className="building-list">
            {nonFavoriteBuildings.map(renderBuildingCard)}
          </div>
        </section>
      </main>

      {showModal && selectedBuilding && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="modal-box">
            <div className="building-number">No. {selectedBuilding.id}</div>
            <div className="modal-building-box">
              <img src={selectedBuilding.image} alt={selectedBuilding.name} />
              <h3>{selectedBuilding.name}</h3>
            </div>
            <p className="modal-label">Available Rooms ({selectedBuilding.availableRooms.length})</p>
            {selectedBuilding.availableRooms.map((room, i) => (
              <div key={i} className="room-row">
                <span>{room.room} <span className="green-dot" /></span>
                <button onClick={() => handleRoomSelect(room)}>Reserve Now →</button>
              </div>
            ))}
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  );
};

export default ReservePage;
