const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

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
