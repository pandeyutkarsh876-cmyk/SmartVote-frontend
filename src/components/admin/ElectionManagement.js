import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { toast } from 'react-hot-toast';
import StatusBadge from '../common/StatusBadge';
import ConfirmDialog from '../common/ConfirmDialog';
import './Admin.css';

const ElectionManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Election form state
  const [elecForm, setElecForm] = useState({ title: '', description: '', startDate: '', endDate: '' });
  const [savingElec, setSavingElec] = useState(false);
  
  // Candidate form state (for add/edit)
  const [candForm, setCandForm] = useState({ id: null, name: '', email: '', party: '', bio: '' });
  const [isEditingCand, setIsEditingCand] = useState(false);
  
  // Confirm dialogs state
  const [confirmDeleteElec, setConfirmDeleteElec] = useState(false);
  const [confirmDeleteCand, setConfirmDeleteCand] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await API.get(`/elections/${id}`);
      const e = res.data.election;
      setElection(e);
      setCandidates(res.data.candidates);
      
      // format dates for datetime-local input
      const formatDT = (isoString) => new Date(isoString).toISOString().slice(0, 16);
      setElecForm({
        title: e.title,
        description: e.description || '',
        startDate: formatDT(e.startDate),
        endDate: formatDT(e.endDate)
      });
    } catch (err) {
      toast.error('Failed to fetch election details');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleElecUpdate = async (e) => {
    e.preventDefault();
    setSavingElec(true);
    try {
      const payload = {
        title: elecForm.title,
        description: elecForm.description,
      };
      
      if (election.status === 'upcoming') {
        payload.startDate = new Date(elecForm.startDate).toISOString();
        payload.endDate = new Date(elecForm.endDate).toISOString();
      } else if (election.status === 'active') {
        payload.endDate = new Date(elecForm.endDate).toISOString();
      }

      const res = await API.put(`/elections/${id}`, payload);
      setElection(res.data.election);
      toast.success('Election updated');
      fetchData(); // refresh status
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSavingElec(false);
    }
  };

  const handleDeleteElection = async () => {
    try {
      await API.delete(`/elections/${id}`);
      toast.success('Election deleted');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const resetCandForm = () => {
    setCandForm({ id: null, name: '', email: '', party: '', bio: '' });
    setIsEditingCand(false);
  };

  const handleCandSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingCand) {
        await API.put(`/candidates/${candForm.id}`, candForm);
        toast.success('Candidate updated');
      } else {
        await API.post('/candidates', { ...candForm, election: id });
        toast.success('Candidate added');
      }
      resetCandForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteCandidate = async () => {
    try {
      await API.delete(`/candidates/${confirmDeleteCand}`);
      toast.success('Candidate deleted');
      setConfirmDeleteCand(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="admin-loading">Loading election details...</div>;
  if (!election) return <div className="empty-state">Election not found</div>;

  const isUpcoming = election.status === 'upcoming';
  const isEnded = election.status === 'ended';

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h2>Election Management</h2>
          <div style={{ marginTop: '0.5rem' }}>
            <StatusBadge status={election.status} />
          </div>
        </div>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/admin')} style={{ marginRight: '1rem' }}>Back</button>
          <button className="btn btn-danger" onClick={() => setConfirmDeleteElec(true)}>Delete Election</button>
        </div>
      </div>

      <div className="admin-card">
        <h3>Configuration</h3>
        <form onSubmit={handleElecUpdate} className="admin-form">
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              value={elecForm.title} 
              onChange={e => setElecForm({...elecForm, title: e.target.value})} 
              disabled={isEnded}
              required 
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              value={elecForm.description} 
              onChange={e => setElecForm({...elecForm, description: e.target.value})}
              disabled={isEnded}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input 
                type="datetime-local" 
                value={elecForm.startDate} 
                onChange={e => setElecForm({...elecForm, startDate: e.target.value})}
                disabled={!isUpcoming} 
                required 
              />
              {!isUpcoming && <small style={{color: '#6B7280'}}>Start date locked once active</small>}
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input 
                type="datetime-local" 
                value={elecForm.endDate} 
                onChange={e => setElecForm({...elecForm, endDate: e.target.value})}
                disabled={isEnded} 
                required 
              />
            </div>
          </div>
          {!isEnded && (
            <button type="submit" className="btn btn-primary mt-4" disabled={savingElec}>
              {savingElec ? 'Saving...' : 'Save Configuration'}
            </button>
          )}
        </form>
      </div>

      <div className="admin-card">
        <h3>Candidates</h3>
        
        {isUpcoming && (
          <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <h4>{isEditingCand ? 'Edit Candidate' : 'Add Candidate'}</h4>
            <form onSubmit={handleCandSubmit} className="admin-form" style={{ marginTop: '1rem' }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={candForm.name} onChange={e=>setCandForm({...candForm, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={candForm.email} onChange={e=>setCandForm({...candForm, email: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Party</label>
                  <input type="text" value={candForm.party} onChange={e=>setCandForm({...candForm, party: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Biography</label>
                  <input type="text" value={candForm.bio} onChange={e=>setCandForm({...candForm, bio: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">{isEditingCand ? 'Update' : 'Add'}</button>
                {isEditingCand && <button type="button" className="btn btn-secondary" onClick={resetCandForm}>Cancel</button>}
              </div>
            </form>
          </div>
        )}

        {!isUpcoming && (
          <div style={{ marginBottom: '1.5rem', color: '#6B7280' }}>
            <p>Candidate management is locked because the election is {election.status}.</p>
          </div>
        )}

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Party</th>
                <th>Email</th>
                {isEnded && <th>Votes</th>}
                {isUpcoming && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">No candidates added yet.</td>
                </tr>
              ) : (
                candidates.map(c => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.party}</td>
                    <td>{c.email}</td>
                    {isEnded && <td><strong>{c.voteCount}</strong></td>}
                    {isUpcoming && (
                      <td>
                        <button className="btn btn-secondary btn-sm" style={{marginRight: '0.5rem'}} onClick={() => {
                          setCandForm({ id: c._id, name: c.name, email: c.email, party: c.party, bio: c.bio || '' });
                          setIsEditingCand(true);
                        }}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirmDeleteCand(c._id)}>Delete</button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={confirmDeleteElec}
        onClose={() => setConfirmDeleteElec(false)}
        onConfirm={handleDeleteElection}
        title="Delete Election"
        message={`Are you sure you want to delete "${election.title}"? This action cannot be undone.`}
        confirmWord="DELETE"
      />
      
      <ConfirmDialog 
        isOpen={!!confirmDeleteCand}
        onClose={() => setConfirmDeleteCand(null)}
        onConfirm={handleDeleteCandidate}
        title="Delete Candidate"
        message="Are you sure you want to remove this candidate?"
        confirmWord="DELETE"
      />
    </div>
  );
};

export default ElectionManagement;
