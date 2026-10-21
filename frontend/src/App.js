import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import AddVehicle from './pages/AddVehicle';
import SearchBook from './pages/SearchBook';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import './App.css';

function Navigation({ user, setUser }) {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h2>🚛 FleetLink</h2>
          <span>Logistics Made Simple</span>
        </div>
        <div className="nav-menu">
          <Link to="/add-vehicle" className={`nav-item ${location.pathname === '/add-vehicle' ? 'active' : ''}`}>
            <span className="nav-icon">➕</span>
            Add Vehicle
          </Link>
          <Link to="/search-book" className={`nav-item ${location.pathname === '/search-book' ? 'active' : ''}`}>
            <span className="nav-icon">🔍</span>
            Search & Book
          </Link>
          {user ? (
            <>
              <Link to="/my-bookings" className={`nav-item ${location.pathname === '/my-bookings' ? 'active' : ''}`}>
                <span className="nav-icon">📋</span>
                My Bookings
              </Link>
              <button
                className="btn"
                style={{ marginLeft: '1rem' }}
                onClick={() => {
                  localStorage.removeItem('token');
                  setUser(null);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
                Login
              </Link>
              <Link to="/register" className={`nav-item ${location.pathname === '/register' ? 'active' : ''}`}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      // Decode token to get user info (simple, not secure for prod)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ userId: payload.userId, username: payload.username });
      } catch {}
    }
  }, [user]);
  return (
    <Router>
      <div className="app">
        <Navigation user={user} setUser={setUser} />
        <main className="main-content">
          <Routes>
            <Route path="/add-vehicle" element={<AddVehicle />} />
            <Route path="/search-book" element={<SearchBook user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-bookings" element={user ? <MyBookings user={user} /> : <Login setUser={setUser} />} />
            <Route path="*" element={<SearchBook user={user} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
