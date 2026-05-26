import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await apiClient.get('/api/auth/me', config);
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user data. Session may have expired.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container dashboard-container">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="container dashboard-container">
      <h2>Dashboard</h2>
      {error && <div className="message error">{error}</div>}

      {user && (
        <>
          <div className="welcome-text">
            Welcome back, <strong>{user.name}</strong>!
          </div>
          <div style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
            Your email: {user.email}
          </div>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Dashboard;
