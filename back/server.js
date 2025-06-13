const mongoose = require('mongoose');
const app = require('./app');
const PORT = process.env.PORT || 8080;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('➡️ Successfully connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));
  
  

// Start server
app.listen(PORT, () => {
    console.log(`➡️ Server is running on http://localhost:${PORT}`);
  });