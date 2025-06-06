// src/components/FavoriteButton.js
import React from 'react';
import filledStar from '../assets/icons/star-filled.png';
import emptyStar from '../assets/icons/star-empty.png';

const FavoriteButton = ({ isFavorite, onClick }) => (
  <img
    src={isFavorite ? filledStar : emptyStar}
    alt="favorite"
    className="star-icon"
    onClick={onClick}
  />
);

export default FavoriteButton;
