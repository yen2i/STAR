import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BuildingCard from '../components/BuildingCard';
import RoomSelectModal from '../components/RoomSelectModal';
import profileImg from '../assets/profile.png';
import '../styles/ProfilePage.css';

const getBuildingImage = (id) => {
  try {
    return require(`../assets/buildings img/${id}.png`);
  } catch {
    return require(`../assets/buildings img/2.png`);
  }
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [favoriteBuildings, setFavoriteBuildings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');

        // 🧾 사용자 정보 요청
        const res = await axios.get('https://star-isih.onrender.com/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = res.data.user;
        setUser(userData);

        // 🏢 건물 목록 요청
        const buildingsRes = await axios.get('https://star-isih.onrender.com/api/buildings');
        const buildingData = buildingsRes.data.buildings;

        // 🧩 즐겨찾기 건물 매칭 + 강의실 정보 병합
        const matched = await Promise.all(
          buildingData
            .filter(b => userData.favorites.includes(b.buildingName))
            .map(async (b) => {
              const roomRes = await axios.get(`https://star-isih.onrender.com/api/buildings/rooms?buildingNo=${b.buildingNo}`);
              const availableRooms = roomRes.data.rooms || [];

              return {
                id: String(b.buildingNo),
                name: b.buildingName,
                image: getBuildingImage(b.buildingNo),
                availableRooms: availableRooms.map(room => ({
                  room: `Room ${room}`,
                  time: '8:00 - 17:50',
                }))
              };
            })
        );
        setFavoriteBuildings(matched);
      } catch (err) {
        console.error('[Error] Failed to load user profile or building data:', err);
        setError('Failed to load profile or building data. Please try again later.');
      }
    };

    fetchProfile();
  }, []);

  const openRoomModal = (building) => {
    setSelectedBuilding(building);
    setShowModal(true);
  };

  const handleRoomSelect = (room) => {
    setShowModal(false);
    const roomNumber = room.room.match(/\d+/)?.[0];
    navigate(`/reserve/${selectedBuilding.name}/${roomNumber}`);
  };

  const toggleFavorite = async (buildingName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) throw new Error('Unauthorized');

      const isAlreadyFavorite = user.favorites.includes(buildingName);
      let updatedFavorites;

      if (isAlreadyFavorite) {
        await axios.delete('https://star-isih.onrender.com/api/users/favorites', {
          headers: { Authorization: `Bearer ${token}` },
          data: { building: buildingName },
        });
        updatedFavorites = user.favorites.filter((n) => n !== buildingName);
      } else {
        await axios.post('https://star-isih.onrender.com/api/users/favorites', { building: buildingName }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        updatedFavorites = [...user.favorites, buildingName];
      }

      // 업데이트된 사용자 즐겨찾기 정보 반영
      const updatedUser = { ...user, favorites: updatedFavorites };
      setUser(updatedUser);

      // 즐겨찾기 건물 다시 매핑
      const buildingsRes = await axios.get('https://star-isih.onrender.com/api/buildings');
      const buildingData = buildingsRes.data.buildings;

      const matched = await Promise.all(
        buildingData
          .filter(b => updatedFavorites.includes(b.buildingName))
          .map(async (b) => {
            const roomRes = await axios.get(`https://star-isih.onrender.com/api/buildings/rooms?buildingNo=${b.buildingNo}`);
            const availableRooms = roomRes.data.rooms || [];

            return {
              id: String(b.buildingNo),
              name: b.buildingName,
              image: getBuildingImage(b.buildingNo),
              availableRooms: availableRooms.map(room => ({
                room: `Room ${room}`,
                time: '8:00 - 17:50',
              }))
            };
          })
      );

      setFavoriteBuildings(matched);
    } catch (err) {
      console.error('[Error] Failed to update favorites:', err);
      alert('Failed to update favorites. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="profile-page">
        <Header />
        <main className="profile-content">
          <p className="error-message">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

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

      {showModal && selectedBuilding && (
        <RoomSelectModal
          building={selectedBuilding}
          onClose={() => setSelectedBuilding(null)}
          onSelectRoom={handleRoomSelect}
        />
      )}

      <Footer />
    </div>
  );
};

export default ProfilePage;
