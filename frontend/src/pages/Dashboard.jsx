import React, { useState, useEffect } from 'react';
import { getDashboardStats, getAppointmentsChart } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    totalCheckups: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, chartRes] = await Promise.all([
        getDashboardStats(),
        getAppointmentsChart()
      ]);
      setStats(statsRes.data);
      setChartData(chartRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Patients</h3>
            <p className="stat-value">{stats.totalPatients}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Total Appointments</h3>
            <p className="stat-value">{stats.totalAppointments}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📆</div>
          <div className="stat-content">
            <h3>Today's Appointments</h3>
            <p className="stat-value">{stats.todayAppointments}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏥</div>
          <div className="stat-content">
            <h3>Total Checkups</h3>
            <p className="stat-value">{stats.totalCheckups}</p>
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="chart-section">
          <h2>Appointments Per Day</h2>
          <div className="chart-container">
            {chartData.map((item, index) => (
              <div key={index} className="chart-bar-wrapper">
                <div className="chart-bar" style={{ height: `${(item.count / Math.max(...chartData.map(d => d.count))) * 200}px` }}>
                  <span className="chart-value">{item.count}</span>
                </div>
                <div className="chart-label">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

