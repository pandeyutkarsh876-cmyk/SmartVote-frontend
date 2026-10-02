import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-hot-toast';
import StatusBadge from './common/StatusBadge';
import './Results.css';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await API.get(`/elections/${id}/results`);
        setElection(res.data.election);
        setCandidates(res.data.candidates.sort((a, b) => b.voteCount - a.voteCount));
      } catch (err) {
        if (err.response?.status === 403) {
          toast.error('Results are not yet available for this election.');
        } else {
          toast.error('Failed to load results');
        }
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id, navigate]);

  if (loading) return <div className="results-loading">Loading results...</div>;
  if (!election) return null;

  const totalVotes = candidates.reduce((sum, c) => sum + (c.voteCount || 0), 0) || election.totalVotes || 0;
  const winner = candidates.length > 0 && candidates[0].voteCount > 0 ? candidates[0] : null;

  return (
    <div className="results-container">
      <div className="results-header">
        <StatusBadge status={election.status} />
        <h2>{election.title} - Final Results</h2>
        <p>Total Votes Cast: <strong>{totalVotes}</strong></p>
      </div>

      {winner && (
        <div className="winner-card">
          <div className="winner-badge">WINNER</div>
          <h3>{winner.name}</h3>
          <p>{winner.party}</p>
          <div className="winner-stats">
            {winner.voteCount} Votes ({((winner.voteCount / totalVotes) * 100).toFixed(1)}%)
          </div>
        </div>
      )}

      <div className="results-list">
        <h3>All Candidates</h3>
        {candidates.map(c => {
          const percentage = totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : 0;
          return (
            <div key={c._id} className="result-item">
              <div className="result-info">
                <span className="result-name">{c.name}</span>
                <span className="result-party">{c.party}</span>
              </div>
              <div className="result-bar-container">
                <div className="result-bar" style={{ width: `${percentage}%` }}></div>
              </div>
              <div className="result-stats">
                {c.voteCount} votes ({percentage}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Results;