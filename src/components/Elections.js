import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Dashboard.css";

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/elections");
      setElections(res.data.elections);
    } catch {
      toast.error("Failed to fetch elections");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => (
    <span className={`status-badge status-${status}`}>
      {status}
    </span>
  );

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
      <header className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="dashboard-eyebrow">Elections</p>
          <h1 className="dashboard-title">All Elections</h1>
          <p className="dashboard-subtitle">
            View every election and its live status.
          </p>
        </div>
      </header>

      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Election List</h2>
          <div className="election-count-pill">
            {elections.length} Elections
          </div>
        </div>

        {elections.length === 0 ? (
          <div className="empty-state">
            <h3>No Elections Found</h3>
            <p>Create an election from the admin panel.</p>
          </div>
        ) : (
          <div className="election-grid">
            {elections.map((election) => (
              <div key={election._id} className="election-card">
                <div className="election-card-header">
                  <h3 className="election-title">{election.title}</h3>
                  {getStatusBadge(election.status)}
                </div>

                <p className="election-description">
                  {election.description}
                </p>

                <div className="election-dates">
                  <div className="date-item">
                    <span className="date-label">Start</span>
                    <span className="date-value">
                      {new Date(
                        election.startDate
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="date-item">
                    <span className="date-label">End</span>
                    <span className="date-value">
                      {new Date(
                        election.endDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="election-actions">
                  <Link
                    to={`/elections/${election._id}/results`}
                    className="btn btn-primary-modern"
                  >
                    View Results
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Elections;