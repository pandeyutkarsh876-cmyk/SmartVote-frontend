import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaVoteYea, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Brand */}
        <NavLink to="/" className="navbar-brand">
          <FaVoteYea className="navbar-logo-icon" />
          <span>SmartVote</span>
        </NavLink>

        {/* Menu */}
        <div className="navbar-menu">
          {user ? (
            <>
              <NavLink to="/dashboard" className="navbar-link">
                Dashboard
              </NavLink>

              <NavLink to="/elections" className="navbar-link">
                Elections
              </NavLink>



              <div className="navbar-user-wrapper">
                <FaUserCircle className="navbar-avatar-icon" />
                <div className="navbar-user-text">
                  <span className="navbar-user-label">Signed in as</span>
                  <span className="navbar-user-name">{user?.name}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="navbar-logout-btn"
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="navbar-link">
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="navbar-cta-btn"
              >
                Get Started
              </NavLink>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
