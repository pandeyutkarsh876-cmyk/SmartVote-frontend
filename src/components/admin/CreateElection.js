import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { toast } from 'react-hot-toast';
import './Admin.css';

const CreateElection = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      await API.post('/elections', {
        ...formData,
        startDate: start.toISOString(),
        endDate: end.toISOString()
      });
      toast.success('Election created successfully');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card max-w-2xl mx-auto">
        <div className="admin-header">
          <h2>Create New Election</h2>
          <button onClick={() => navigate('/admin')} className="btn btn-secondary">Back</button>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date & Time</label>
              <input type="datetime-local" name="startDate" required value={formData.startDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>End Date & Time</label>
              <input type="datetime-local" name="endDate" required value={formData.endDate} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
            {loading ? 'Creating...' : 'Create Election'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateElection;
