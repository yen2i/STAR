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
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');

        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(res.data.user);
      } catch (err) {
        console.warn('⚠️ 서버에서 유저 정보를 불러오지 못함. 로컬 mock 데이터로 대체');

        // 🔁 localStorage에 저장된 mock 유저 정보로 대체
        const localUser = localStorage.getItem('user');
        if (localUser) {
          setUser(JSON.parse(localUser));
        } else {
          alert('유저 정보를 불러올 수 없습니다.');
        }
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
            {user.favorites?.map((room, index) => (
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
