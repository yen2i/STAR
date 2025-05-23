import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ProfilePage.css';
import profileImg from '../assets/profile.png'; // 실제 프로필 이미지 경로 지정

const ProfilePage = () => {
  const user = {
    name: '박신형',
    studentNumber: '23102009',
    major: 'ITM',
    favorites: ['프론티어관', '다산관'],
  };

  return (
    <div className="profile-page">
      <Header />
      <main className="profile-content">
        <h2>My Information</h2>
        <div className="profile-box">
          <img src={profileImg} alt="profile" />
          <div className="profile-info">
            <div><strong>{user.name}</strong></div>
            <div>{user.studentNumber}</div>
            <div>{user.major}</div>
          </div>
        </div>
        <h2>My Favorite Classroom</h2>
        <div className="favorites-box">
          <ul>
            {user.favorites.map((room, index) => (
              <li key={index}>▶ {room}</li>
            ))}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
