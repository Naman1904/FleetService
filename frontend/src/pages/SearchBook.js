import React, { useState } from 'react';
import axios from 'axios';

function SearchBook() {
  const [form, setForm] = useState({ capacityRequired: '', fromPincode: '', toPincode: '', startTime: '' });
  const [results, setResults] = useState([]);
  const [duration, setDuration] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setResults([]);
    
    try {
      const res = await axios.get('/api/vehicles/available', {
        params: form,
      });
      setResults(res.data.vehicles);
      setDuration(res.data.estimatedRideDurationHours);
      
      if (res.data.vehicles.length === 0) {
        setMessage('No vehicles available for the selected criteria. Try adjusting your search parameters.');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error searching vehicles');
    }
    setLoading(false);
  };

  const handleBook = async (vehicleId) => {
    setMessage('');
    setBookingLoading(vehicleId);
    
    try {
      await axios.post('/api/bookings', {
        vehicleId,
        fromPincode: form.fromPincode,
        toPincode: form.toPincode,
        startTime: form.startTime,
        customerId: 'demo-customer',
      });
      setMessage('🎉 Booking successful! Your vehicle has been reserved.');
      // Remove booked vehicle from results
      setResults(prev => prev.filter(v => v._id !== vehicleId));
    } catch (err) {
      setMessage(err.response?.data?.error || 'Booking failed. Please try again.');
    }
    setBookingLoading(null);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Search & Book Vehicles</h1>
      <p className="page-subtitle">Find the perfect vehicle for your logistics needs</p>
      
      <div className="form-container">
        <form onSubmit={handleSearch}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Capacity Required (KG)</label>
              <input 
                className="form-input"
                name="capacityRequired" 
                type="number" 
                placeholder="e.g., 500" 
                value={form.capacityRequired} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Start Date & Time</label>
              <input 
                className="form-input"
                name="startTime" 
                type="datetime-local" 
                value={form.startTime} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">From Pincode</label>
              <input 
                className="form-input"
                name="fromPincode" 
                placeholder="e.g., 110001" 
                value={form.fromPincode} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">To Pincode</label>
              <input 
                className="form-input"
                name="toPincode" 
                placeholder="e.g., 110010" 
                value={form.toPincode} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <button className="btn btn-center" type="submit" disabled={loading}>
            {loading ? '⏳ Searching...' : '🔍 Search Available Vehicles'}
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="results-container">
          <h2 className="results-title">
            🚛 Available Vehicles ({results.length} found)
          </h2>
          
          <ul className="vehicle-grid">
            {results.map(vehicle => (
              <li key={vehicle._id} className="vehicle-card">
                <div className="vehicle-name">
                  🚚 {vehicle.name}
                </div>
                
                <div className="vehicle-details">
                  <div className="vehicle-detail">
                    <strong>Capacity:</strong> {vehicle.capacityKg} KG
                  </div>
                  <div className="vehicle-detail">
                    <strong>Tyres:</strong> {vehicle.tyres}
                  </div>
                </div>

                <div className="vehicle-duration">
                  ⏱️ Estimated Duration: {duration} hours
                </div>

                <button 
                  className="btn btn-book" 
                  onClick={() => handleBook(vehicle._id)}
                  disabled={bookingLoading === vehicle._id}
                >
                  {bookingLoading === vehicle._id ? '⏳ Booking...' : '📅 Book Now'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBook;
