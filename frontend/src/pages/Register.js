import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.post('/api/auth/register', form);
      setMessage('Registration successful! You can now login.');
      setForm({ username: '', password: '' });
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Register</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          <button className="btn btn-center" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        {message && <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</div>}
      </div>
    </div>
  );
}

export default Register;
