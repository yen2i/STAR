import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import '../styles/MyReservationPage.css';

const MyReservationPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const reservations = [
    { id: 1, building: '다산관', room: '107호', time: '9시~10시' },
    { id: 2, building: '프론티어관', room: '402호', time: '10시~11시' },
  ];

  const handleCancel = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const confirmCancel = () => {
    console.log('예약 취소됨:', selectedReservation);
    setShowModal(false);
    setSelectedReservation(null);
    // 실제로는 API 호출 필요
  };

  return (
    <div className="my-reservation-page">
      <Header />

      <main className="my-reservation-content">
        <h2>내 예약 목록</h2>
        <div className="reservation-list">
          {reservations.map((res) => (
            <div key={res.id} className="reservation-item">
              <div>
                {res.building}, {res.room}, {res.time}
              </div>
              <button onClick={() => handleCancel(res)}>예약취소</button>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="modal-content">
            <p>예약이 취소되었습니다.</p>
            <button onClick={() => setShowModal(false)}>확인</button>
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  );
};

export default MyReservationPage;
