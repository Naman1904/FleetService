const express = require('express');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const router = express.Router();

function getRideDuration(fromPincode, toPincode) {
  return Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
}

// POST /api/bookings: Book a vehicle
router.post('/', auth, async (req, res) => {
  const { vehicleId, fromPincode, toPincode, startTime } = req.body;
  const customerId = req.user.userId;
  if (!vehicleId || !fromPincode || !toPincode || !startTime || !customerId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const estimatedRideDurationHours = getRideDuration(fromPincode, toPincode);
  const start = new Date(startTime);
  const end = new Date(start.getTime() + estimatedRideDurationHours * 60 * 60 * 1000);
  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    const conflict = await Booking.findOne({
      vehicleId,
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } },
      ],
    });
    if (conflict) return res.status(409).json({ error: 'Vehicle already booked for this time slot' });
    const booking = new Booking({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      customerId,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/bookings/me: Get bookings for logged-in user
router.get('/me', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.userId }).populate('vehicleId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Bonus: DELETE /api/bookings/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await Booking.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
