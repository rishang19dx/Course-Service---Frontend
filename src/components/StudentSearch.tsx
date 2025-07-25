import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentSearch.css';

const StudentSearch: React.FC = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!studentId.trim()) {
      setError('Student ID is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Navigate to update form with student ID
      navigate(`/update-student/${studentId.trim()}`);
    } catch (err) {
      setError('Failed to search student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-search-container">
      <header className="search-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h2>Update Student Details</h2>
        <p>Enter the Student ID to search and update student information</p>
      </header>

      <div className="search-main">
        <div className="search-box">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="form-group">
              <label htmlFor="studentId">Student ID</label>
              <input
                type="text"
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter Student ID (e.g., B21CS001)"
                className={error ? 'error' : ''}
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="search-button"
              disabled={loading || !studentId.trim()}
            >
              {loading ? 'Searching...' : 'Find & Update Student'}
            </button>
          </form>

          <div className="search-tips">
            <h4>Search Tips:</h4>
            <ul>
              <li>Enter the exact Student ID as registered in the system</li>
              <li>Student ID is case-sensitive</li>
              <li>Make sure the student exists in the database</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSearch;
