const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const vehicleRoutes = require('./routes/vehicles');
const bookingRoutes = require('./routes/bookings');
const authRoutes = require('./routes/auth');

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('FleetLink API is running');
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/fleetlink');
  console.log('MongoDB connected successfully');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exitCode = 1;
  });
}

module.exports = app;
