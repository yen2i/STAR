// src/pages/RoomDetailPage.js
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/RoomDetailPage.css';

const RoomDetailPage = () => {
  const events = [
    {
      title: '예약됨',
      start: '2025-06-03T10:00:00',
      end: '2025-06-03T12:00:00',
      backgroundColor: 'gray',
      editable: false,
    },
    {
      title: '예약 가능',
      start: '2025-06-04T13:00:00',
      end: '2025-06-04T15:00:00',
      backgroundColor: '#47a',
    },
  ];

  return (
    <div className="room-detail-page">
      <Header />

      <main className="calendar-container">
        <h2>다산관 107호 시간표</h2>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          allDaySlot={false}
          slotMinTime="09:00:00"
          slotMaxTime="18:00:00"
          height="auto"
          events={events}
          selectable={false}
        />
      </main>

      <Footer />
    </div>
  );
};

export default RoomDetailPage;
