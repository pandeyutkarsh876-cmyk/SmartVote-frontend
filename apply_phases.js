const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const compDir = path.join(srcDir, 'components');
const adminDir = path.join(compDir, 'admin');
const commonDir = path.join(compDir, 'common');

// 1. Landing Page
const landingCode = `import React from 'react';
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
export default Landing;`;

const landingCss = `.landing-page { text-align: center; }
.hero-section { background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); color: white; padding: 6rem 2rem; }
.hero-title { font-size: 3.5rem; margin-bottom: 1rem; font-weight: 800; }
.hero-subtitle { font-size: 1.5rem; margin-bottom: 2.5rem; opacity: 0.9; }
.hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.btn-lg { padding: 1rem 2rem; font-size: 1.125rem; font-weight: 600; border-radius: 8px; }
.btn-secondary { background: white; color: #1E3A8A; border: none; }
.btn-secondary:hover { background: #F3F4F6; }
.features-section { padding: 5rem 2rem; background: #F9FAFB; }
.features-section h2 { font-size: 2.5rem; color: #111827; margin-bottom: 3rem; }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
.feature-card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: left; }
.feature-icon { color: #3B82F6; margin-bottom: 1.5rem; }
.feature-card h3 { font-size: 1.5rem; margin-bottom: 1rem; color: #1F2937; }
.feature-card p { color: #4B5563; line-height: 1.6; }
.landing-footer { background: #111827; color: #9CA3AF; padding: 2rem; }`;

// 2. Voting.js (Phase 4)
const votingCode = `import React, { useState, useEffect } from 'react';
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
          API.get(\`/elections/\${id}\`),
          API.get(\`/candidates?election=\${id}\`)
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
          <div key={c._id} className={\`candidate-card \${selectedCandidate?._id === c._id ? 'selected' : ''}\`} onClick={() => setSelectedCandidate(c)}>
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
        message={\`Are you sure you want to vote for \${selectedCandidate?.name} (\${selectedCandidate?.party})? This action is permanent and cannot be changed.\`}
        confirmWord="CONFIRM"
      />
    </div>
  );
};
export default Voting;`;

const votingCss = `.voting-container { max-width: 1000px; margin: 2rem auto; padding: 0 1.5rem; }
.voting-header { text-align: center; margin-bottom: 3rem; }
.voting-header h2 { font-size: 2.5rem; color: #111827; margin-bottom: 0.5rem; }
.voting-subtitle { font-size: 1.5rem; color: #3B82F6; font-weight: 600; margin-bottom: 1rem; }
.voting-desc { color: #6B7280; max-width: 600px; margin: 0 auto; }
.candidates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 3rem; }
.candidate-card { background: white; border: 2px solid #E5E7EB; border-radius: 12px; padding: 2rem; cursor: pointer; transition: all 0.2s; position: relative; }
.candidate-card:hover { border-color: #93C5FD; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
.candidate-card.selected { border-color: #3B82F6; background: #EFF6FF; }
.party-badge { display: inline-block; background: #E5E7EB; color: #374151; padding: 4px 12px; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; margin: 1rem 0; }
.candidate-bio { color: #4B5563; font-size: 0.95rem; line-height: 1.5; margin-bottom: 2rem; }
.select-indicator { position: absolute; bottom: 1.5rem; right: 1.5rem; font-weight: 600; color: #9CA3AF; }
.candidate-card.selected .select-indicator { color: #3B82F6; }
.voting-actions { display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid #E5E7EB; padding-top: 2rem; }
.voting-loading { text-align: center; padding: 5rem; font-size: 1.2rem; color: #6B7280; }`;

// 3. Results.js (Phase 6)
const resultsCode = `import React, { useState, useEffect } from 'react';
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
        const res = await API.get(\`/elections/\${id}/results\`);
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
                <div className="result-bar" style={{ width: \`\${percentage}%\` }}></div>
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
export default Results;`;

const resultsCss = `.results-container { max-width: 800px; margin: 2rem auto; padding: 0 1.5rem; }
.results-header { text-align: center; margin-bottom: 3rem; }
.results-header h2 { font-size: 2rem; color: #111827; margin: 1rem 0; }
.winner-card { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 3rem; border-radius: 12px; text-align: center; margin-bottom: 3rem; position: relative; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
.winner-badge { position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 0.875rem; }
.winner-card h3 { font-size: 2.5rem; margin-bottom: 0.5rem; }
.winner-stats { margin-top: 1.5rem; font-size: 1.25rem; font-weight: 600; background: rgba(255,255,255,0.15); display: inline-block; padding: 8px 24px; border-radius: 9999px; }
.results-list { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.results-list h3 { margin-bottom: 2rem; color: #374151; border-bottom: 2px solid #F3F4F6; padding-bottom: 1rem; }
.result-item { margin-bottom: 1.5rem; }
.result-info { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.result-name { font-weight: 600; color: #111827; }
.result-party { color: #6B7280; font-size: 0.875rem; }
.result-bar-container { background: #E5E7EB; height: 12px; border-radius: 9999px; overflow: hidden; margin-bottom: 0.5rem; }
.result-bar { background: #3B82F6; height: 100%; transition: width 1s ease-in-out; }
.result-stats { text-align: right; font-size: 0.875rem; color: #4B5563; font-weight: 500; }
.results-loading { text-align: center; padding: 5rem; color: #6B7280; font-size: 1.2rem; }`;

// 4. Update App.js
const appCode = fs.readFileSync(path.join(srcDir, 'App.js'), 'utf8')
  .replace("import Dashboard from './components/Dashboard';", "import Dashboard from './components/Dashboard';\nimport Landing from './components/Landing';")
  .replace('<Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />', '<Route path="/" element={<Landing />} />\n            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />');

// 5. Update Navbar links
const navbarCode = fs.readFileSync(path.join(compDir, 'Navbar.js'), 'utf8')
  .replace('<NavLink to="/" end className="navbar-link">\n                Dashboard\n              </NavLink>', '<NavLink to="/dashboard" className="navbar-link">\n                Dashboard\n              </NavLink>');

// Write files
fs.writeFileSync(path.join(compDir, 'Landing.js'), landingCode);
fs.writeFileSync(path.join(compDir, 'Landing.css'), landingCss);
fs.writeFileSync(path.join(compDir, 'Voting.js'), votingCode);
fs.writeFileSync(path.join(compDir, 'Voting.css'), votingCss);
fs.writeFileSync(path.join(compDir, 'Results.js'), resultsCode);
fs.writeFileSync(path.join(compDir, 'Results.css'), resultsCss);
fs.writeFileSync(path.join(srcDir, 'App.js'), appCode);
fs.writeFileSync(path.join(compDir, 'Navbar.js'), navbarCode);

console.log('Successfully generated Phase 4-6 components.');
