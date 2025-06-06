// src/components/HotspotCard.js
import React from 'react';
import '../styles/HotspotCard.css';

const HotspotCard = ({ rank, building, onReserveClick }) => {
  const rankLabel = ['1st', '2nd', '3rd'][rank - 1];

  // 등수에 따라 클래스 이름 분기
  const rankClass =
    rank === 1 ? 'first' :
    rank === 2 ? 'second' :
    rank === 3 ? 'third' :
    '';

  return (
    <div className={`hotspot-card ${rankClass}`}>
      <div className="rank">{rankLabel}</div>
      <img src={building.image} alt={building.name} className="hotspot-img" />
      <div className="building-name">{building.name}</div>
      <button onClick={() => onReserveClick(building)}>Reserve Now →</button>
    </div>
  );
};

export default HotspotCard;
