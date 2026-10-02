import React from "react";
import { Link } from "react-router-dom";
import { FaVoteYea, FaUsers, FaUserTie } from "react-icons/fa";
import "./Dashboard.css";

const AdminDashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">
          Manage elections, candidates and voters.
        </p>
      </div>

      <div className="quick-actions">
        <Link to="/create-election" className="action-card">
          <FaVoteYea size={28}/>
          <h3>Create Election</h3>
          <p>Create a new election</p>
        </Link>

        <Link to="/candidates/register" className="action-card">
          <FaUserTie size={28}/>
          <h3>Candidates</h3>
          <p>Manage candidates</p>
        </Link>

        <Link to="/elections" className="action-card">
          <FaUsers size={28}/>
          <h3>All Elections</h3>
          <p>View all elections</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;