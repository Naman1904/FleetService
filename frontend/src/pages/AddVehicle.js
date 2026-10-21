import React, { useState } from 'react';
import axios from 'axios';

function AddVehicle() {
  const [form, setForm] = useState({ name: '', capacityKg: '', tyres: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      await axios.post('/api/vehicles', {
        name: form.name,
        capacityKg: Number(form.capacityKg),
        tyres: Number(form.tyres),
      });
      setMessage('Vehicle added successfully! 🎉');
      setForm({ name: '', capacityKg: '', tyres: '' });
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error adding vehicle');
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Add New Vehicle</h1>
      <p className="page-subtitle">Expand your fleet by adding a new logistics vehicle</p>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Vehicle Name</label>
            <input 
              className="form-input"
              name="name" 
              placeholder="e.g., Truck Alpha, Van Beta" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Capacity (KG)</label>
              <input 
                className="form-input"
                name="capacityKg" 
                type="number" 
                placeholder="e.g., 1000" 
                value={form.capacityKg} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Number of Tyres</label>
              <input 
                className="form-input"
                name="tyres" 
                type="number" 
                placeholder="e.g., 6" 
                value={form.tyres} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <button className="btn btn-center" type="submit" disabled={loading}>
            {loading ? '⏳ Adding...' : '➕ Add Vehicle'}
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddVehicle;
