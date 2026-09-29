import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Voting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, fetchUser } = useAuth();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchElectionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchElectionData = async () => {
    try {
      const [electionRes, candidatesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/elections/${id}`),
        axios.get(`http://localhost:5000/api/candidates?election=${id}`)
      ]);

      setElection(electionRes.data.election);
      setCandidates(candidatesRes.data.candidates);

      if (electionRes.data.election.status !== 'active') {
        toast.error('This election is not currently active');
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to load election data');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }

    if (user?.votedElections?.includes(id)) {
      toast.error('You have already voted');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post('http://localhost:5000/api/votes', {
        candidate: selectedCandidate,
        election: id
      });

      toast.success('Vote cast successfully!');
      await fetchUser();
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cast vote');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (user?.votedElections?.includes(id)) {
    return (
      <div className="container">
        <div className="card">
          <h2>You have already voted</h2>
          <p>You cannot vote again in this election.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>{election?.title}</h1>
        {election?.description && <p style={{ marginBottom: '2rem', color: '#666' }}>{election.description}</p>}
        
        <h2 style={{ marginBottom: '1.5rem' }}>Select a Candidate</h2>
        
        {candidates.length === 0 ? (
          <p>No candidates registered for this election.</p>
        ) : (
          <>
            {candidates.map((candidate) => (
              <div
                key={candidate._id}
                className={`candidate-card ${selectedCandidate === candidate._id ? 'selected' : ''}`}
                onClick={() => setSelectedCandidate(candidate._id)}
              >
                <h4>{candidate.name}</h4>
                <div className="party">Party: {candidate.party}</div>
                {candidate.bio && <p style={{ marginTop: '0.5rem', color: '#666' }}>{candidate.bio}</p>}
              </div>
            ))}
            
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleVote}
                className="btn btn-success"
                disabled={!selectedCandidate || submitting}
              >
                {submitting ? 'Submitting...' : 'Cast Vote'}
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Voting;

