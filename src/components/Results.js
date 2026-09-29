import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css'; // reuse design system (spinner, cards, etc.)

const Results = () => {
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchResults = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/elections/${id}/results`
      );
      setResults(res.data);
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Loading results…</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="dashboard-page">
        <section className="dashboard-section">
          <div className="empty-state">
            <h3>Results not available</h3>
            <p>The requested election results could not be found.</p>
            <div style={{ marginTop: '1.2rem' }}>
              <Link to="/" className="btn btn-primary-modern">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // NOTE: assuming backend now returns: { election, candidates, totalVotes, winner, isDraw }
  const { election, candidates, totalVotes, winner, isDraw } = results;
  const normalizedStatus = election.status?.toLowerCase();
  const statusClass = `status-badge status-${normalizedStatus}`;
  const maxVotes = Math.max(...candidates.map((c) => c.voteCount), 1);

  // For easier checks
  const isWinnerArray = Array.isArray(winner);
  const drawHasMultiple = isDraw && isWinnerArray && winner.length > 1;

  // Helper: check if candidate is part of tie/winner list
  const candidateIsWinner = (candidate) => {
    if (!winner) return false;

    if (isDraw && isWinnerArray) {
      return winner.some((w) => w._id === candidate._id);
    }

    // normal single winner case
    return !isDraw && !isWinnerArray && winner._id === candidate._id;
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="dashboard-eyebrow">Election Results</p>
          <h1 className="dashboard-title">{election.title}</h1>
          <p className="dashboard-subtitle">
            Detailed breakdown of votes received by each candidate and the final outcome
            of this election.
          </p>
        </div>
      </header>

      <section className="dashboard-section results-section">
        <div className="results-layout">
          {/* Summary card */}
          <div className="results-summary-card">
            <div className="results-status-row">
              <div>
                <span className="results-label">Status</span>
                <span className={statusClass}>
                  {election.status.toUpperCase()}
                </span>
              </div>
              <div className="results-stat-chip">
                <span className="results-stat-label">Total votes</span>
                <span className="results-stat-value">{totalVotes}</span>
              </div>
            </div>

            {/* Single clear winner */}
            {winner && !isDraw && !isWinnerArray && (
              <div className="results-winner-banner">
                <div className="results-trophy">🏆</div>
                <div>
                  <p className="results-winner-label">Winner</p>
                  <h2 className="results-winner-name">{winner.name}</h2>
                  <p className="results-winner-meta">
                    Party: <strong>{winner.party}</strong> • Votes:{' '}
                    <strong>{winner.voteCount}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Draw / tie between multiple candidates */}
            {drawHasMultiple && (
              <div className="results-winner-banner">
                <div className="results-trophy">🤝</div>
                <div>
                  <p className="results-winner-label">Result</p>
                  <h2 className="results-winner-name">Election is a draw</h2>
                  <p className="results-winner-meta">
                    Top candidates have the same number of votes.
                  </p>
                  <ul style={{ marginTop: '0.4rem', paddingLeft: '1.1rem' }}>
                    {winner.map((cand) => (
                      <li key={cand._id} style={{ fontSize: '0.9rem', color: '#166534' }}>
                        <strong>{cand.name}</strong> ({cand.party}) — {cand.voteCount} votes
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="results-info-row">
              <div className="results-info-col">
                <span className="results-label">Start date</span>
                <span className="results-info-value">
                  {new Date(election.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="results-info-col">
                <span className="results-label">End date</span>
                <span className="results-info-value">
                  {new Date(election.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {election.description && (
              <p className="results-description">{election.description}</p>
            )}
          </div>

          {/* Candidates list */}
          <div className="results-candidates-card">
            <div className="results-candidates-header">
              <h2>All candidates</h2>
              <span className="results-count-pill">
                {candidates.length} candidate
                {candidates.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="results-list">
              {candidates.map((candidate) => {
                const percentage =
                  totalVotes > 0
                    ? ((candidate.voteCount / totalVotes) * 100).toFixed(1)
                    : 0;

                const isWinnerCandidate = candidateIsWinner(candidate);

                return (
                  <div
                    key={candidate._id}
                    className={
                      'results-item' +
                      (isWinnerCandidate ? ' results-item--winner' : '')
                    }
                  >
                    <div className="results-item-header">
                      <div>
                        <h3 className="results-candidate-name">
                          {candidate.name}
                        </h3>
                        <p className="results-candidate-party">
                          Party: {candidate.party}
                          {isWinnerCandidate && isDraw && ' • Top (tied)'}
                          {isWinnerCandidate && !isDraw && ' • Winner'}
                        </p>
                      </div>
                      <div className="results-vote-summary">
                        <span className="results-vote-count">
                          {candidate.voteCount} votes
                        </span>
                        <span className="results-vote-percent">
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="vote-bar">
                      <div
                        className="vote-fill"
                        style={{
                          width: `${(candidate.voteCount / maxVotes) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="results-back-row">
          <Link to="/" className="btn btn-ghost-modern">
            Back to Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Results;
