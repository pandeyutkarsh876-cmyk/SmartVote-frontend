import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import StatusBadge from '../common/StatusBadge';
import { toast } from 'react-hot-toast';
import './Admin.css';

const AdminDashboard = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search, Filter, Sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  const navigate = useNavigate();

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await API.get('/elections');
      setElections(res.data.elections);
    } catch (error) {
      toast.error('Failed to load elections');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading elections...</div>;

  // Apply Search
  let filteredElections = elections.filter(election => 
    election.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply Filter
  if (statusFilter !== 'all') {
    filteredElections = filteredElections.filter(election => election.status === statusFilter);
  }

  // Apply Sort
  filteredElections.sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate);
    } else if (sortOption === 'oldest') {
      return new Date(a.createdAt || a.startDate) - new Date(b.createdAt || b.startDate);
    } else if (sortOption === 'title-asc') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'title-desc') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <Link to="/admin/elections/new" className="btn btn-primary">Create Election</Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search by title..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: '1 1 250px', padding: '0.6rem', borderRadius: '6px', border: '1px solid #D1D5DB' }}
        />
        
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}
        >
          <option value="all">All Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="ended">Ended</option>
        </select>

        <select 
          value={sortOption} 
          onChange={(e) => setSortOption(e.target.value)}
          style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>
      </div>

      <div className="admin-card">
        {filteredElections.length === 0 ? (
          <div className="empty-state">No elections found matching your criteria.</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredElections.map(election => (
                  <tr key={election._id}>
                    <td><strong>{election.title}</strong></td>
                    <td><StatusBadge status={election.status} /></td>
                    <td>{new Date(election.startDate).toLocaleString()}</td>
                    <td>{new Date(election.endDate).toLocaleString()}</td>
                    <td>
                      <button 
                        onClick={() => navigate(`/admin/elections/${election._id}`)}
                        className="btn btn-secondary btn-sm"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
