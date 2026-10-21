import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/bookings/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        setMessage('Failed to fetch bookings');
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">My Bookings</h1>
      {loading ? <div className="loading">Loading...</div> : null}
      {message && <div className="message error">{message}</div>}
      {bookings.length > 0 ? (
        <ul className="vehicle-grid">
          {bookings.map(b => (
            <li key={b._id} className="vehicle-card">
              <div className="vehicle-name">{b.vehicleId?.name || 'Vehicle'}</div>
              <div className="vehicle-details">
                <div className="vehicle-detail"><strong>From:</strong> {b.fromPincode}</div>
                <div className="vehicle-detail"><strong>To:</strong> {b.toPincode}</div>
              </div>
              <div className="vehicle-duration">
                <strong>Start:</strong> {new Date(b.startTime).toLocaleString()}<br/>
                <strong>End:</strong> {new Date(b.endTime).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      ) : !loading && <div className="message">No bookings found.</div>}
    </div>
  );
}

export default MyBookings;
