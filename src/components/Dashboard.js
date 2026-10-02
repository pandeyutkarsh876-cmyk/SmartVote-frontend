import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { FaVoteYea, FaUsers, FaCheckCircle } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await API.get("/elections");
      setElections(res.data.elections);
    } catch (err) {
      toast.error("Failed to fetch elections");
    } finally {
      setLoading(false);
    }
  };

  const firstName = user?.name?.split(" ")[0] || "User";
  const activeCount = elections.filter(
    (e) => e.status === "active"
  ).length;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading elections...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Hero */}
      <div className="dashboard-hero">
        <div>
          <p className="dashboard-eyebrow">
            SMART DIGITAL VOTING PLATFORM
          </p>

          <h1 className="dashboard-title">
            Welcome back, {firstName} 👋
          </h1>

          <p className="dashboard-subtitle">
            Secure online voting with real-time election results.
          </p>

          <div className="hero-stats">
            <div className="stat-box">
              <FaVoteYea size={24} />
              <div>
                <h3>{activeCount}</h3>
                <span>Active</span>
              </div>
            </div>

            <div className="stat-box">
              <FaUsers size={24} />
              <div>
                <h3>{elections.length}</h3>
                <span>Elections</span>
              </div>
            </div>

            <div className="stat-box">
              <FaCheckCircle size={24} />
              <div>
                <h3>{user?.votedElections?.length || 0}</h3>
                <span>Votes Cast</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elections */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Available Elections</h2>
        </div>

        {elections.length === 0 ? (
          <div className="empty-state">
            <h3>No Elections Available</h3>
            <p>New elections will appear here.</p>
          </div>
        ) : (
          <div className="election-grid">
            {elections.map((election) => (
              <div key={election._id} className="election-card">
                <h3>{election.title}</h3>
                <p>{election.description}</p>

                <div className="election-actions">
                  {election.status === "active" && !user?.votedElections?.includes(election._id) && (
                    <Link
                      to={`/elections/${election._id}/vote`}
                      className="btn btn-primary-modern"
                    >
                      Vote
                    </Link>
                  )}

                  <Link
                    to={`/elections/${election._id}/results`}
                    className="btn btn-ghost-modern"
                  >
                    Results
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/elections" className="action-card">
          <h3>🗳️ Vote Now</h3>
          <p>Participate in active elections</p>
        </Link>



        <Link to="/elections" className="action-card">
          <h3>📊 Results</h3>
          <p>Track election results instantly</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;