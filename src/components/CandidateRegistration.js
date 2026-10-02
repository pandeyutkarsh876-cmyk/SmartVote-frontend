import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CandidateRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    party: '',
    bio: '',
    election: ''
  });
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingElections, setFetchingElections] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/elections');
      setElections(res.data.elections);
    } catch (error) {
      toast.error('Failed to fetch elections');
    } finally {
      setFetchingElections(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/candidates', formData);
      toast.success('Candidate registration successful!');
      setFormData({
        name: '',
        email: '',
        party: '',
        bio: '',
        election: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Register as Candidate</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="party">Party Name</label>
            <input
              type="text"
              id="party"
              name="party"
              value={formData.party}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="election">Select Election</label>
            <select
              id="election"
              name="election"
              value={formData.election}
              onChange={handleChange}
              required
              disabled={fetchingElections}
            >
              <option value="">Select an election</option>
              {elections.map((election) => (
                <option key={election._id} value={election._id}>
                  {election.title} ({election.status})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="bio">Biography (Optional)</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading || fetchingElections}
          >
            {loading ? 'Registering...' : 'Register as Candidate'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateRegistration;

