import React from 'react';
import '../styles/ReservePage.css'; // ReservePage와 동일한 스타일 사용
import FavoriteButton from './FavoriteButton';

const BuildingCard = ({
  building,
  isFavorite,
  onReserveClick,
  onToggleFavorite
}) => {
  return (
    <div className="building-card" key={building.id}>
      <img src={building.image} alt={building.name} className="building-img" />
      <div className="building-info">
        <div className="building-number">No. {building.id}</div>
        <div className="building-name">{building.name}</div>
        <div className="available-cunot">
          🟢 Available Rooms ({building.availableRooms.length})
        </div>
      </div>
      <button className="reserve-btn" onClick={() => onReserveClick(building)}>Reserve Now →</button>
      <FavoriteButton
        isFavorite={isFavorite}
        onClick={() => onToggleFavorite(building.name)}
        />
    </div>
  );
};

export default BuildingCard;
