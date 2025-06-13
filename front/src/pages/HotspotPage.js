import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      alert('즐겨찾기 변경 실패!');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <Header />
      <main className="profile-content">
        <h2>My Information</h2>
        <div className="profile-box">
          <img src={profileImg} alt="profile" />
          <div className="profile-info">
            <div><strong>{user.name}</strong></div>
            <div>{user.studentNumber}</div>
            <div>{user.major}</div>
          </div>
        </div>

        <h2>My Favorite Classrooms</h2>
        <div className="building-list">
          {favoriteBuildings.length > 0 ? (
            favoriteBuildings.map((building) => (
              <BuildingCard
                key={building.id}
                building={building}
                isFavorite={user.favorites.includes(building.name)}
                onReserveClick={openRoomModal}
                onToggleFavorite={toggleFavorite}
              />
            ))
          ) : (
            <p>You have no favorite classrooms yet.</p>
          )}
        </div>
      </main>

      <RoomSelectModal
        building={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        onSelectRoom={handleRoomSelect}
      />

      <Footer />
    </div>
  );
};

export default ProfilePage;
