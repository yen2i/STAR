import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  // TODO: 실제 데이터는 추후 API로 받아오게 변경 예정
  const user = {
    name: '박신형',
    major: 'ITM전공',
    favorites: ['프론티어관', '다산관'],
  };

  return (
    <div className="profile-page">
      <Header />

      <main className="profile-content">
        <h2>내 정보</h2>

        <div className="profile-box">
          <div><strong>이름:</strong> {user.name}</div>
          <div><strong>전공:</strong> {user.major}</div>
        </div>

        <div className="favorites-box">
          <h3>즐겨찾는 강의실</h3>
          <ul>
            {user.favorites.map((room, index) => (
              <li key={index}>{room}</li>
            ))}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
