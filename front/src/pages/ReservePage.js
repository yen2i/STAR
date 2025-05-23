import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ReservePage.css';

const ReservePage = () => {
  // TODO: 실제 데이터는 추후 props or API로 받아올 예정
  const favoriteBuildings = ['프론티어관']; // 즐겨찾기 예시
  const allBuildings = ['프론티어관', '다산관', '창학관'];

  return (
    <div className="reserve-page">
      <Header />

      <main className="reserve-content">
        {/* 검색 바 */}
        <div className="search-bar">
          <input type="text" placeholder="건물 검색" />
        </div>

        {/* 즐겨찾는 건물 */}
        {favoriteBuildings.length > 0 && (
          <div className="favorites-section">
            <h3>즐겨찾는 건물</h3>
            <div className="building-list">
              {favoriteBuildings.map((name, index) => (
                <div key={index} className="building-card">
                  <div className="thumbnail-box">[이미지]</div>
                  <div className="building-name">{name}</div>
                  <button>⭐</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 전체 건물 리스트 */}
        <div className="all-section">
          <h3>건물 리스트</h3>
          <div className="building-list">
            {allBuildings.map((name, index) => (
              <div key={index} className="building-card">
                <div className="thumbnail-box">[이미지]</div>
                <div className="building-name">{name}</div>
                <button>⭐</button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReservePage;

