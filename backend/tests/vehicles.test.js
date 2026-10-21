const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

describe('FleetLink Vehicle API', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/fleetlink_test');
  });
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should add a new vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({ name: 'Truck A', capacityKg: 1000, tyres: 6 });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Truck A');
  });

  it('should not add vehicle with missing fields', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({ name: 'Truck B', tyres: 6 });
    expect(res.statusCode).toBe(400);
  });

  it('should find available vehicles (no overlap)', async () => {
    const vehicle = await Vehicle.create({ name: 'Truck C', capacityKg: 2000, tyres: 8 });
    const res = await request(app)
      .get('/api/vehicles/available')
      .query({ capacityRequired: 1500, fromPincode: '100001', toPincode: '100010', startTime: new Date().toISOString() });
    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles.length).toBeGreaterThan(0);
  });
});
