import React, { useState } from 'react';
import axios from 'axios';

function Login({ setUser }) {
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
      const res = await axios.post('/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setMessage('Login successful!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Login</h1>
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {message && <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</div>}
      </div>
    </div>
  );
}

export default Login;
