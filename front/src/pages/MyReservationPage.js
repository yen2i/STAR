import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import '../styles/MyReservationPage.css';
import frontierImg from '../assets/buildings img/32_frontier.png';
import dasanImg from '../assets/buildings img/2_dasan.png';

const MyReservationPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const reservations = [
    {
      id: 1,
      building: 'Frontier Hall',
      image: frontierImg,
      room: 'Room 107',
      time: '8:00-10:50',
      date: '5/23',
      number: 32,
    },
    {
      id: 2,
      building: 'Dasan Hall',
      image: dasanImg,
      room: 'Room 201',
      time: '9:00-9:50',
      date: '5/26',
      number: 1,
    },
  ];

  const handleCancel = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const confirmCancel = () => {
    console.log('예약 취소됨:', selectedReservation);
    setShowModal(false);
    setSelectedReservation(null);
  };

  return (
    <div className="my-reservation-page">
      <Header />

      <main className="my-reservation-content">
        <h2>My reservation ({reservations.length})</h2>
        <div className="reservation-list">
          {reservations.map((res) => (
            <div key={res.id} className="reservation-card">
              <img src={res.image} alt={res.building} className="reservation-img" />
              <div className="reservation-info">
                <div className="reservation-building-number">No.{res.number}</div>
                <div className="reservation-building">{res.building}</div>
                <div className="reservation-detail">- {res.room} ({res.time}, {res.date})</div>
              </div>
              <button className="cancel-button" onClick={() => handleCancel(res)}>
                Cancel Reservation →
              </button>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="modal-content">
            <p>The reservation has been cancelled.</p>
            <button onClick={() => setShowModal(false)}>OK</button>
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  );
};

export default MyReservationPage;
