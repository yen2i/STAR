import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HotspotCard from '../components/HotspotCard';
import RoomSelectModal from '../components/RoomSelectModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/HotspotPage.css';

const CATEGORIES = [
  'Auditorium Size / Large Hall',
  'Study Friendly',
  'Meeting & Presentation / Collab Zones',
];

const HotspotPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [hotspots, setHotspots] = useState([]);
  const [modalBuilding, setModalBuilding] = useState(null);
  const navigate = useNavigate();

  const getBuildingImage = (id) => {
    try {
      return require(`../assets/buildings img/${id}.png`);
    } catch {
      return require(`../assets/buildings img/2.png`);
    }
  };

  const fetchData = async (category) => {
    try {
      let response;

      if (category === 'Auditorium Size / Large Hall') {
        response = await axios.get('https://star-isih.onrender.com/api/analytics/popular-buildings/by-large-group');
      } else if (category === 'Study Friendly') {
        response = await axios.get('https://star-isih.onrender.com/api/analytics/popular-buildings/by-purpose?purpose=Study');
      } else if (category === 'Meeting & Presentation / Collab Zones') {
        response = await axios.get('https://star-isih.onrender.com/api/analytics/popular-buildings/by-purpose?purpose=Meeting');
      }

      const hotspotData = Array.isArray(response.data) ? response.data : [response.data];

      const allBuildingsRes = await axios.get('https://star-isih.onrender.com/api/buildings');
      const allBuildings = allBuildingsRes.data.buildings;

      const matched = hotspotData.map((item, i) => {
        const match = allBuildings.find(b => b.buildingName === item._id);
        const buildingNo = match?.buildingNo || '2';

        return {
          id: String(buildingNo),
          name: item._id,
          rank: i + 1,
          image: getBuildingImage(buildingNo),
        };
      });

      setHotspots(matched);
    } catch (err) {
      console.error('[Hotspot Fetch Error] Failed to load hotspot data:', err);
      setHotspots([]); // fallback 제거: 빈 배열로 처리
    }
  };

  useEffect(() => {
    fetchData(selectedCategory);
  }, [selectedCategory]);

  const handleReserve = async (building) => {
    try {
      const res = await axios.get(`https://star-isih.onrender.com/api/buildings/rooms?buildingNo=${building.id}`);
      const availableRooms = res.data.rooms.map(room => ({
        room: `Room ${room}`,
        time: '08:00 - 17:50',
      }));

      setModalBuilding({
        id: building.id,
        name: building.name,
        image: building.image,
        availableRooms,
      });
    } catch (err) {
      console.error('[Room Fetch Error] Failed to fetch available rooms:', err);
      alert('Failed to load available rooms. Please try again later.');
    }
  };

  const handleCloseModal = () => {
    setModalBuilding(null);
  };

  const handleSelectRoom = (room) => {
    const roomNumber = room.room.match(/\d+/)?.[0];
    navigate(`/reserve/${modalBuilding.name}/${roomNumber}`);
    handleCloseModal();
  };

  return (
    <div className="hotspot-page">
      <Header />
      <div className="category-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={cat === selectedCategory ? 'active' : ''}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="category-divider"></div>

      <div className="hotspot-display">
        {[1, 2, 3].map((desiredRank) => {
          const building = hotspots.find(b => b.rank === desiredRank);
          return building ? (
            <HotspotCard
              key={building.id + desiredRank}
              rank={building.rank}
              building={building}
              onReserveClick={handleReserve}
            />
          ) : null;
        })}
      </div>

      {modalBuilding && (
        <RoomSelectModal
          building={modalBuilding}
          onClose={handleCloseModal}
          onSelectRoom={handleSelectRoom}
        />
      )}

      <Footer />
    </div>
  );
};

export default HotspotPage;
