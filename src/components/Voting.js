import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-hot-toast';
import ConfirmDialog from './common/ConfirmDialog';
import './Voting.css';

const Voting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const [elecRes, candRes] = await Promise.all([
          API.get(`/elections/${id}`),
          API.get(`/candidates?election=${id}`)
        ]);
        setElection(elecRes.data.election);
        setCandidates(candRes.data.candidates);
      } catch (err) {
        toast.error('Failed to load election details');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchElectionData();
  }, [id, navigate]);

  const handleVote = async () => {
    setSubmitting(true);
    try {
      await API.post('/votes', { candidate: selectedCandidate._id, election: id });
      toast.success('Vote cast successfully! Your vote is securely recorded.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Voting failed');
      setConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="voting-loading">Loading election data...</div>;
  if (!election || election.status !== 'active') return <div className="empty-state">This election is not active.</div>;

  return (
    <div className="voting-container">
      <div className="voting-header">
        <h2>Cast Your Vote</h2>
        <p className="voting-subtitle">{election.title}</p>
        <p className="voting-desc">{election.description}</p>
      </div>

      <div className="candidates-grid">
        {candidates.map(c => (
          <div key={c._id} className={`candidate-card ${selectedCandidate?._id === c._id ? 'selected' : ''}`} onClick={() => setSelectedCandidate(c)}>
            <h3>{c.name}</h3>
            <span className="party-badge">{c.party}</span>
            <p className="candidate-bio">{c.bio || 'No biography provided.'}</p>
            <div className="select-indicator">
              {selectedCandidate?._id === c._id ? 'Selected' : 'Select'}
            </div>
          </div>
        ))}
      </div>

      <div className="voting-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
        <button 
          className="btn btn-primary" 
          disabled={!selectedCandidate || submitting}
          onClick={() => setConfirmOpen(true)}
        >
          {submitting ? 'Submitting...' : 'Submit Vote'}
        </button>
      </div>

      <ConfirmDialog 
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleVote}
        title="Confirm Your Vote"
        message={`Are you sure you want to vote for ${selectedCandidate?.name} (${selectedCandidate?.party})? This action is permanent and cannot be changed.`}
        confirmWord="CONFIRM"
      />
    </div>
  );
};
export default Voting;