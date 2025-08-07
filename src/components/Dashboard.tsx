import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getSessionToken } from '../utils/api';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => logout();
  const uid = getSessionToken();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/logo.jpg" alt="IIT Mandi" className="logo" />
            <div className="institute-name">
              <h1>Course Management System</h1>
              <p>Administrator Dashboard</p>
            </div>
          </div>
          <div className="user-section">
            <span>Welcome, Admin </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <h2>Quick Actions</h2>

          <div className="dashboard-actions">
            <div
              className="action-card"
              onClick={() => navigate('/create-student')}
            >
              <span style={{fontSize: 48}}>🎓</span>
              <h3>Create Student</h3>
              <p>Add a new student record with default credentials.</p>
            </div>
            <div
              className="action-card"
              onClick={() => navigate('/student-search')}
            >
              <span style={{fontSize: 48}}>✏️</span>
              <h3>Update Student</h3>
              <p>Search and modify existing student information and credentials.</p>
            </div>
            <div
              className="action-card"
              onClick={() => navigate('/create-announcement')}
            >
              <span style={{fontSize: 48}}>📢</span>
              <h3>Post Announcement</h3>
              <p>Share important updates and notifications with students and faculty.</p>
            </div>
            <div className="action-card" onClick={() => navigate('/create-course')}>
              <span style={{fontSize: 48}}>➕</span>
              <h3>Create Course</h3>
              <p>Add a new course to the database.</p>
            </div>
            <div className="action-card" onClick={() => navigate('/update-course')}>
              <span style={{fontSize: 48}}>📝</span>
              <h3>Update Course</h3>
              <p>Edit or update details of an existing course.</p>
            </div>
            <div className="action-card" onClick={() => navigate('/edit-course-helpers')}>
              <span style={{ fontSize: 44 }}>🛠️</span>
              <h3>Edit Course Helpers</h3>
              <p>Edit which branches/programs are allowed for a course and how.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
