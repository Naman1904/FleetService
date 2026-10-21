const express = require('express');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const router = express.Router();

// Helper: Calculate ride duration
function getRideDuration(fromPincode, toPincode) {
  return Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
}

// POST /api/vehicles: Add a new vehicle
router.post('/', async (req, res) => {
  const { name, capacityKg, tyres } = req.body;
  if (!name || typeof capacityKg !== 'number' || typeof tyres !== 'number') {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const vehicle = new Vehicle({ name, capacityKg, tyres });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/vehicles/available: Find available vehicles
router.get('/available', async (req, res) => {
  const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
  if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
    return res.status(400).json({ error: 'Missing query parameters' });
  }
  const estimatedRideDurationHours = getRideDuration(fromPincode, toPincode);
  const start = new Date(startTime);
  const end = new Date(start.getTime() + estimatedRideDurationHours * 60 * 60 * 1000);
  try {
    const vehicles = await Vehicle.find({ capacityKg: { $gte: Number(capacityRequired) } });
    const bookings = await Booking.find({
      vehicleId: { $in: vehicles.map(v => v._id) },
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } },
      ],
    });
    const bookedIds = bookings.map(b => b.vehicleId.toString());
    const availableVehicles = vehicles.filter(v => !bookedIds.includes(v._id.toString()));
    res.json({ vehicles: availableVehicles, estimatedRideDurationHours });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
