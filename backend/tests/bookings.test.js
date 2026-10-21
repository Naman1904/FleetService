const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

describe('FleetLink Booking API', () => {
  let vehicle;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/fleetlink_test');
    vehicle = await Vehicle.create({ name: 'Truck D', capacityKg: 1500, tyres: 6 });
  });
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should create a booking if available', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({
        vehicleId: vehicle._id,
        fromPincode: '100001',
        toPincode: '100010',
        startTime: new Date().toISOString(),
        customerId: 'cust1',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.vehicleId).toBe(vehicle._id.toString());
  });

  it('should not create booking if overlap', async () => {
    const startTime = new Date().toISOString();
    await Booking.create({
      vehicleId: vehicle._id,
      fromPincode: '100001',
      toPincode: '100010',
      startTime,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      customerId: 'cust2',
    });
    const res = await request(app)
      .post('/api/bookings')
      .send({
        vehicleId: vehicle._id,
        fromPincode: '100002',
        toPincode: '100012',
        startTime,
        customerId: 'cust3',
      });
    expect(res.statusCode).toBe(409);
  });
});
