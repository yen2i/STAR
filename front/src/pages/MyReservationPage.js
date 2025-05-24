import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import '../styles/MyReservationPage.css';

// ⛳ 빌딩 번호 → 파일 이름 매핑
const getBuildingFileName = (number) => {
  const map = {
    2: 'dasan',
    3: 'changhak',
    4: 'second start-up incubation center',
    5: 'hyeseong',
    6: 'cheongun',
    7: 'technopark',
    8: 'changjo',
    14: 'pottery practice',
    31: 'start-up incubation center',
    32: 'frontier',
    38: 'international',
    39: 'davinchi',
    40: 'eoui',
    51: '100years',
    53: 'SangSang',
    54: 'areum',
    57: 'endlessness',
    '57-A': 'endlessness',
    60: 'mirae',
    62: 'technocube',
  };
  return map[number] || 'dasan';
};

// 이미지 로드 시 fallback 처리 포함
const getBuildingImage = (number) => {
  try {
    return require(`../assets/buildings img/${number}_${getBuildingFileName(number)}.png`);
  } catch {
    return require('../assets/buildings img/2_dasan.png');
  }
};

const MyReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState('confirm'); // 'confirm' | 'success'
  const [selectedReservation, setSelectedReservation] = useState(null);

  // 📦 예약 정보 불러오기 (API or mock)
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/reservations/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReservations(res.data.reservations);
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

  const confirmCancel = () => {
    // 실제 API 요청이 필요하면 여기에 axios.delete 추가
    setReservations(reservations.filter(r => r.id !== selectedReservation.id));
    setModalStep('success');
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
