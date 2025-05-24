import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ProfilePage.css';
import profileImg from '../assets/profile.png';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // 로그인 후 저장된 토큰
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        alert('유저 정보를 불러올 수 없습니다.');
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <div>Loading...</div>;

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
