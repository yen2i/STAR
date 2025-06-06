// src/pages/HotspotPage.js
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HotspotCard from '../components/HotspotCard';
import { useNavigate } from 'react-router-dom';
import '../styles/HotspotPage.css';

// 임시 MOCK 데이터
const MOCK_HOTSPOTS = [
  {
    id: '32',
    name: 'Frontier Hall',
    image: require('../assets/buildings img/32.png'),
  },
  {
    id: '2',
    name: 'Dasan Hall',
    image: require('../assets/buildings img/2.png'),
  },
  {
    id: '2',
    name: 'Dasan Hall',
    image: require('../assets/buildings img/2.png'),
  },
];

const CATEGORIES = [
  'Most Visited',
  'Auditorium Size / Large Hall',
  'Study Friendly',
  'Meeting & Presentation / Collab Zones',
];

const HotspotPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const navigate = useNavigate();

  const handleReserve = (building) => {
    navigate(`/reserve/${building.name}`);
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

      <div className="hotspot-display">
        {MOCK_HOTSPOTS.map((building, index) => (
          <HotspotCard
            key={index}
            rank={index + 1}
            building={building}
            onReserveClick={handleReserve}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default HotspotPage;
