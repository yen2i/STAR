import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import '../styles/MyReservationPage.css';

// ✅ 이미지 경로: 번호 기반으로 정리된 경우
const getBuildingImage = (number) => {
  try {
    return require(`../assets/buildings img/${number}.png`);
  } catch {
    return require('../assets/buildings img/2.png'); // default: Dasan Hall
  }
};

const MyReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState('confirm');
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/reservations/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReservations(res.data);
      } catch (err) {
        console.warn('⚠️ 백엔드 실패 - mock 데이터 사용');
        setReservations([
          {
            id: 1,
            building: 'Frontier Hall',
            number: 32,
            room: 'Room 107',
            time: '8:00-10:50',
            date: '5/23',
          },
          {
            id: 2,
            building: 'Dasan Hall',
            number: 2,
            room: 'Room 201',
            time: '9:00-9:50',
            date: '5/26',
          }
        ]);
      }
    };

    fetchReservations();
  }, []);

  const handleCancel = (reservation) => {
    setSelectedReservation(reservation);
    setModalStep('confirm');
    setShowModal(true);
  };

const confirmCancel = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/reservations/${selectedReservation._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // 성공 시 프론트 상태 업데이트
    setReservations(reservations.filter(r => r._id !== selectedReservation._id));
    setModalStep('success');
  } catch (err) {
    console.error('❌ 예약 취소 실패:', err);
    alert('Reservation cancel failed.');
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
        <div className="reservation-list">
          {reservations.map((res) => (
            <div key={res.id} className="reservation-card">
              <img src={getBuildingImage(res.number)} alt={res.building} className="reservation-img" />
              <div className="reservation-info">
                <div className="reservation-building-number">No.{res.number}</div>
                <div className="reservation-building">{res.building}</div>
                <div className="reservation-detail">- {res.room} ({res.startTime}-{res.endTime}, {res.date})</div>
              </div>
              <button className="cancel-button" onClick={() => handleCancel(res)}>
                Cancel Reservation →
              </button>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <Modal onClose={closeModal} size="medium">
          {modalStep === 'confirm' ? (
            <div>
              <div className="modal-card">
                <div className="modal-title">{selectedReservation.building}</div>
                <div className="modal-sub">{selectedReservation.room}</div>
                <div className="modal-sub">- {selectedReservation.time}, {selectedReservation.date}</div>
              </div>
              <p style={{ marginTop: '24px' }}>Are you sure to cancel your reservation?</p>
              <div className="modal-buttons">
                <button onClick={confirmCancel}>Yes!</button>
                <button onClick={closeModal}>No!</button>
              </div>
            </div>
          ) : (
            <div>
              <p>Reservation canceled successfully!</p>
              <div className="modal-buttons">
                <button onClick={closeModal}>Check Reservation</button>
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
