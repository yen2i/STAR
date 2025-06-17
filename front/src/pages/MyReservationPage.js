import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import '../styles/MyReservationPage.css';

const getBuildingImage = (number) => {
  try {
    return require(`../assets/buildings img/${number}.png`);
  } catch {
    return require('../assets/buildings img/2.png');
  }
};

const MyReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState('confirm');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [error, setError] = useState('');

  const fetchBuildings = async () => {
    try {
      const res = await axios.get('https://star-isih.onrender.com/api/buildings');
      setBuildings(res.data.buildings || []);
    } catch (err) {
      console.error('[Error] Failed to load buildings:', err);
      setError('Failed to load building information. Please try again later.');
    }
  };

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://star-isih.onrender.com/api/reservations/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(res.data);
    } catch (err) {
      console.error('[Error] Failed to fetch reservations:', err);
      setError('Failed to load reservations. Please try again later.');
    }
  };

  useEffect(() => {
    fetchBuildings();
    fetchReservations();
  }, []);

  const getBuildingNo = (name) => {
    const found = buildings.find(b => b.buildingName === name);
    return found?.buildingNo || 2;
  };

  const handleCancel = (reservation) => {
    setSelectedReservation(reservation);
    setModalStep('confirm');
    setShowModal(true);
  };

  const confirmCancel = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://star-isih.onrender.com/api/reservations/${selectedReservation._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(prev => prev.filter(r => r._id !== selectedReservation._id));
      setModalStep('success');
    } catch (err) {
      console.error('[Error] Cancel failed:', err);
      alert('Failed to cancel reservation. Please try again.');
      closeModal();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReservation(null);
    setModalStep('confirm');
  };

  return (
    <div className="my-reservation-page">
      <Header />
      <main className="my-reservation-content">
        <h2>My reservation ({reservations.length})</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="reservation-list">
          {reservations.map((res) => {
            const buildingNo = getBuildingNo(res.building);
            return (
              <div key={res._id} className="reservation-card">
                <img src={getBuildingImage(buildingNo)} alt={res.building} className="reservation-img" />
                <div className="reservation-info">
                  <div className="reservation-building-number">No.{buildingNo}</div>
                  <div className="reservation-building">{res.building}</div>
                  <div className="reservation-detail">
                    - Room {res.room} ({res.startTime} - {res.endTime}, {res.date})
                  </div>
                </div>
                <button className="cancel-button" onClick={() => handleCancel(res)}>
                  Cancel Reservation →
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {showModal && selectedReservation && (
        <Modal onClose={closeModal} size="medium">
          {modalStep === 'confirm' ? (
            <div>
              <div className="modal-card">
                <div className="modal-title">{selectedReservation.building}</div>
                <div className="modal-sub">Room {selectedReservation.room}</div>
                <div className="modal-sub">
                  - {selectedReservation.startTime} ~ {selectedReservation.endTime}, {selectedReservation.date}
                </div>
              </div>
              <p style={{ marginTop: '24px' }}>Are you sure you want to cancel this reservation?</p>
              <div className="modal-buttons">
                <button onClick={confirmCancel}>Yes</button>
                <button onClick={closeModal}>No</button>
              </div>
            </div>
          ) : (
            <div>
              <p>Reservation canceled successfully!</p>
              <div className="modal-buttons">
                <button onClick={closeModal}>OK</button>
              </div>
            </div>
          )}
        </Modal>
      )}

      <Footer />
    </div>
  );
};

export default MyReservationPage;
