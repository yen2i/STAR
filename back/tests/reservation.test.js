const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server'); // 메모리 서버 사용
const moment = require('moment');

jest.setTimeout(15000);

let mongoServer;

const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');

const testReservation = {
  building: "Frontier Hall",
  room: "107",
  date: tomorrow,
  startTime: "09:00",
  endTime: "10:00",
  purpose: "Study",
  peopleCount: 10
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri); // 진짜 DB가 아니라 메모리로 연결
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop(); // 메모리 DB 종료
});

describe('Reservation API', () => {
  it('should create a reservation successfully', async () => {
    const res = await request(app)
      .post('/api/reservations') 
      .send(testReservation);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Reservation completed successfully!');
  });

  it('should fail reservation due to time conflict', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send(testReservation); // 같은 예약 한 번 더 요청

    expect(res.statusCode).toBe(409); 
    expect(res.body).toHaveProperty('message', 'Some periods are already reserved'); 
  });

  it('should fetch user reservations', async () => {
    const res = await request(app)
      .get('/api/reservations/my');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  const isConflict = (a1, b1, a2, b2) => !(b1 < a2 || b2 < a1);

  it('should detect time conflicts correctly', () => {
    expect(isConflict(3, 4, 4, 5)).toBe(true);   // 겹침
    expect(isConflict(1, 2, 3, 4)).toBe(false);  // 안 겹침
  });
});
