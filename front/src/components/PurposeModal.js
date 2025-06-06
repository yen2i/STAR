// src/components/PurposeModal.js
import React, { useState } from 'react';
import '../styles/PurposeModal.css';

const PurposeModal = ({ onClose, onSubmit }) => {
  const [people, setPeople] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleSubmit = () => {
    if (!people || !purpose) {
      alert('Please select both number of people and purpose.');
      return;
    }
    onSubmit({ people, purpose });
    onClose();
  };

  return (
    <div className="purpose-modal-overlay">
      <div className="purpose-modal">
        <h2>Reservation Purpose</h2>

        <div className="modal-field">
          <label>Number of People</label>
          <select value={people} onChange={(e) => setPeople(e.target.value)}>
            <option value="">Select</option>
            <option value="1-2">1–2</option>
            <option value="3-5">3–5</option>
            <option value="6-10">6–10</option>
            <option value="11+">11+</option>
          </select>
        </div>

        <div className="modal-field">
          <label>Purpose</label>
          <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            <option value="">Select</option>
            <option value="Study">Study</option>
            <option value="Meeting">Meeting</option>
            <option value="Project">Team Project</option>
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
