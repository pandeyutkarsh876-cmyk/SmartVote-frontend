import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';
import Elections from './components/Elections';
import Voting from './components/Voting';
import Results from './components/Results';
import AdminDashboard from "./components/admin/AdminDashboard";
import CreateElection from "./components/admin/CreateElection";
import ElectionManagement from "./components/admin/ElectionManagement";
import AdminRoute from "./components/common/AdminRoute";
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

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
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/elections" element={<Elections />} />
            <Route path="/elections/:id/vote" element={<PrivateRoute><Voting /></PrivateRoute>} />
            <Route path="/elections/:id/results" element={<Results />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/elections/new" element={<AdminRoute><CreateElection /></AdminRoute>} />
            <Route path="/admin/elections/:id" element={<AdminRoute><ElectionManagement /></AdminRoute>} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

