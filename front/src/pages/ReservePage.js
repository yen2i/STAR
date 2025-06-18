import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BuildingCard from '../components/BuildingCard';
import RoomSelectModal from '../components/RoomSelectModal';
import '../styles/ReservePage.css';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavoriteIds(stored);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token missing');

        const [buildingsRes, userRes] = await Promise.all([
          axios.get('https://star-isih.onrender.com/api/buildings'),
          axios.get('https://star-isih.onrender.com/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        const buildingData = buildingsRes.data.buildings;
        const favoritesFromServer = userRes.data.user.favorites || [];

        const buildingList = await Promise.all(
          buildingData.map(async (b) => {
            const roomRes = await axios.get(
              `https://star-isih.onrender.com/api/buildings/rooms?buildingNo=${b.buildingNo}`
            );
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

        setBuildings(buildingList);
        setFavoriteIds(favoritesFromServer);
        localStorage.setItem('favorites', JSON.stringify(favoritesFromServer));
      } catch (err) {
        console.error('❌ Failed to load building or user data:', err);
        setError('Failed to load data. Please check your connection or login again.');
      }
    };

    fetchData();
  }, []);

  const toggleFavorite = async (buildingName) => {
    const token = localStorage.getItem('token');
    const isAlreadyFavorite = favoriteIds.includes(buildingName);

    try {
      if (!token) throw new Error('User not authenticated');

      if (isAlreadyFavorite) {
        await axios.delete('https://star-isih.onrender.com/api/users/favorites', {
          headers: { Authorization: `Bearer ${token}` },
          data: { building: buildingName },
        });
        const updated = favoriteIds.filter(name => name !== buildingName);
        setFavoriteIds(updated);
        localStorage.setItem('favorites', JSON.stringify(updated));
      } else {
        await axios.post(
          'https://star-isih.onrender.com/api/users/favorites',
          { building: buildingName },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const updated = [...favoriteIds, buildingName];
        setFavoriteIds(updated);
        localStorage.setItem('favorites', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('❌ Failed to update favorites:', err);
      alert('Failed to update favorites. Please try again after logging in.');
    }
  };

  const openRoomModal = (building) => {
    setSelectedBuilding(building);
    setShowModal(true);
  };

  const handleRoomSelect = (room) => {
    setShowModal(false);
    const roomNumber = room.room.match(/\d+/)?.[0];
    navigate(`/reserve/${selectedBuilding.name}/${roomNumber}`);
  };

  const filteredBuildings = buildings
    .filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(b => b.availableRooms.length > 0);

  const favoriteBuildings = filteredBuildings.filter(b => favoriteIds.includes(b.name));
  const nonFavoriteBuildings = filteredBuildings.filter(b => !favoriteIds.includes(b.name));

  return (
    <div className="reserve-page">
      <Header />
      <main className="reserve-content">
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search a Classroom"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {favoriteBuildings.length > 0 && (
              <section>
                <h3>Favorite Classrooms</h3>
                <div className="building-list">
                  {favoriteBuildings.map((building) => (
                    <BuildingCard
                      key={building.id}
                      building={building}
                      isFavorite={true}
                      onReserveClick={openRoomModal}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3>Buildings</h3>
              <div className="building-list">
                {nonFavoriteBuildings.map((building) => (
                  <BuildingCard
                    key={building.id}
                    building={building}
                    isFavorite={false}
                    onReserveClick={openRoomModal}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </section>
          </>
        )}
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

export default ReservePage;
