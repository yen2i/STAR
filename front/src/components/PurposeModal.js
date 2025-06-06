import React, { useState } from 'react';
import '../styles/PurposeModal.css';

const PurposeModal = ({ onClose, onSubmit }) => {
  const [peopleCount, setPeople] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleSubmit = () => {
    if (!peopleCount || !purpose) {
      alert('Please select both number of people and purpose.');
      return;
    }

    onSubmit({
      peopleCount: Number(peopleCount), // 숫자로 백엔드에 전송
      purpose,
    });

    onClose();
  };

  return (
    <div className="purpose-modal-overlay">
      <div className="purpose-modal">
        <h2>Reservation Purpose</h2>

        <div className="modal-field">
          <label>Number of People</label>
          <select value={peopleCount} onChange={(e) => setPeople(e.target.value)}>
            <option value="">Select</option>
            <option value="10">1–10</option>
            <option value="30">11–30</option>
            <option value="50">31–50</option>
            <option value="100">51+</option>
          </select>
        </div>

        <div className="modal-field">
          <label>Purpose</label>
          <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            <option value="">Select</option>
            <option value="Study">Study</option>
            <option value="Meeting">Meeting</option>
            <option value="Club">Club Activity</option>
            <option value="Presentation">Presentation</option>
            <option value="Project">Team Project</option>
            <option value="Department Event">Department Event</option>
            <option value="Etc">Others</option>
          </select>
        </div>

        <div className="modal-buttons">
          <button onClick={handleSubmit}>Submit</button>
          <button className="cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PurposeModal;
