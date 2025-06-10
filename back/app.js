const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

const reservationRoutes = require('./routes/reservationRoutes');

const timetableRoutes = require('./routes/timetableRoutes');

const buildingRoutes = require('./routes/buildingRoutes');

const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
//app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
//   }));
app.use(cors({
    origin: 'http://localhost:3000',  // 프론트 주소
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/analytics', analyticsRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('STAR backend server is running!');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Successfully connected to MongoDB'))
  .catch(err => console.error('❌ Failed to connect to MongoDB:', err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
