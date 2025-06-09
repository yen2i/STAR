import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HotspotCard from '../components/HotspotCard';
import RoomSelectModal from '../components/RoomSelectModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/HotspotPage.css';

const CATEGORIES = [
  'Most Visited',
  'Auditorium Size / Large Hall',
  'Study Friendly',
  'Meeting & Presentation / Collab Zones',
];

const HotspotPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [hotspots, setHotspots] = useState([]);
  const [modalBuilding, setModalBuilding] = useState(null);
  const navigate = useNavigate();

  const fetchData = async (category) => {
    try {
      let response;
      if (category === 'Most Visited') {
        response = await axios.get('/api/analytics/popular-buildings');
      } else if (category === 'Auditorium Size / Large Hall') {
        response = await axios.get('/api/analytics/popular-buildings/by-large-group');
      } else if (category === 'Study Friendly') {
        response = await axios.get('/api/analytics/popular-buildings/by-purpose?purpose=스터디');
      } else if (category === 'Meeting & Presentation / Collab Zones') {
        response = await axios.get('/api/analytics/popular-buildings/by-purpose?purpose=면접 준비');
      }

      const data = Array.isArray(response.data) ? response.data : [response.data];

      const buildings = data.map((item, i) => {
        const id = parseInt(item._id?.match(/\d+/)?.[0] || i); // buildingNo 추출
        return {
          id: String(id),
          name: item._id,
          rank: i + 1,
          image: require(`../assets/buildings img/${id}.png`),
        };
      });

      setHotspots(buildings);
    } catch (err) {
      console.error('🔥 Fallback to mock data due to error:', err);
      setHotspots([
        {
          id: '32',
          rank: 1,
          name: 'Frontier Hall',
          image: require('../assets/buildings img/32.png'),
        },
        {
          id: '2',
          rank: 2,
          name: 'Dasan Hall',
          image: require('../assets/buildings img/2.png'),
        },
        {
          id: '2',
          rank: 3,
          name: 'Dasan Hall',
          image: require('../assets/buildings img/2.png'),
        },
      ]);
    }
  };

  useEffect(() => {
    fetchData(selectedCategory);
  }, [selectedCategory]);

  const handleReserve = async (building) => {
    try {
      const res = await axios.get(`/api/buildings/rooms?buildingNo=${building.id}`);
      const availableRooms = res.data.rooms.map(room => ({
        room: room,
      }));
  
      setModalBuilding({
        id: building.id,
        name: building.name,
        image: building.image,
        availableRooms,
      });
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
  
      // ✅ Fallback mock data
      const mockRooms = [
        { room: 'Room 101', time: '08:00 - 09:50' },
        { room: 'Room 202', time: '10:00 - 11:50' },
      ];
  
      setModalBuilding({
        id: building.id,
        name: building.name,
        image: building.image,
        availableRooms: mockRooms,
      });
    }
  };
  

  const handleCloseModal = () => {
    setModalBuilding(null);
  };

  const handleSelectRoom = (room) => {
    const roomNumber = room.room.match(/\d+/)?.[0]; // 숫자만 추출 (예: '107')
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
