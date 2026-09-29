import AdminDashboard from "./components/AdminDashboard";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Elections from './components/Elections';
import Voting from './components/Voting';
import Results from './components/Results';
import CandidateRegistration from './components/CandidateRegistration';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import CreateElection from "./components/CreateElection";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/elections" element={<Elections />} />
            <Route path="/elections/:id/vote" element={<PrivateRoute><Voting /></PrivateRoute>} />
            <Route path="/elections/:id/results" element={<Results />} />
            <Route path="/candidates/register" element={<CandidateRegistration />} />
            <Route path="/create-election" element={<CreateElection />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

