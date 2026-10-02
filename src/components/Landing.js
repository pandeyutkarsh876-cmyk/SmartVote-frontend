import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaVoteYea, FaShieldAlt, FaChartBar, FaUserCheck } from 'react-icons/fa';
import './Landing.css';

const Landing = () => {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />;

  return (
    <div className="landing-page">
      <header className="hero-section">
        <div className="hero-content">
          <FaVoteYea size={64} className="hero-icon" />
          <h1 className="hero-title">SmartVote</h1>
          <p className="hero-subtitle">Secure, Transparent, and Professional Online Voting</p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary btn-lg">Login to Vote</Link>
            <Link to="/elections" className="btn btn-secondary btn-lg">Explore Elections</Link>
          </div>
        </div>
      </header>

      <section className="features-section">
        <h2>Why SmartVote?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaShieldAlt size={32} className="feature-icon" />
            <h3>Secure & Verified</h3>
            <p>Role-based access control and strict identity verification ensure every vote is authentic.</p>
          </div>
          <div className="feature-card">
            <FaChartBar size={32} className="feature-icon" />
            <h3>Real-time Analytics</h3>
            <p>Monitor election results securely as soon as the election officially concludes.</p>
          </div>
          <div className="feature-card">
            <FaUserCheck size={32} className="feature-icon" />
            <h3>Integrity Guaranteed</h3>
            <p>Atomic database transactions guarantee your vote is counted exactly once.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} SmartVote Enterprise. All rights reserved.</p>
      </footer>
    </div>
  );
};
export default Landing;