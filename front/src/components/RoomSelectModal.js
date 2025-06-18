import React from 'react';
import Modal from './Modal';

const RoomSelectModal = ({ building, onClose, onSelectRoom }) => {
  if (!building) return null;

  return (
    <Modal onClose={onClose}>
      <div className="room-select-modal-content">
        <div className="building-number">No. {building.id}</div>
        <div className="modal-building-box">
          <img src={building.image} alt={building.name} />
          <h3>{building.name}</h3>
        </div>
        <p className="modal-label">
          Available Rooms ({building.availableRooms.length})
        </p>
        {[...building.availableRooms]
        .sort((a, b) => {
          const numA = parseInt(a.room.match(/\d+/)?.[0]);
          const numB = parseInt(b.room.match(/\d+/)?.[0]);
          return numA - numB;
        })
        .map((room, i) => (
          <div key={i} className="room-row">
            <span>
              {room.room} <span className="green-dot" />
            </span>
            <button onClick={() => onSelectRoom(room)}>
              Reserve Now →
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default RoomSelectModal;
