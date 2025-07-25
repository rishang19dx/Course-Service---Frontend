import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateStudent, getStudentDetails, UpdateStudentRequest, StudentDetails } from '../utils/api';
import './UpdateStudent.css';

const UpdateStudent: React.FC = () => {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();

  const [form, setForm] = useState<UpdateStudentRequest>({
    student_id: '',
    name: '',
    branch: '',
    batch: '',
    program: '',
    school: '',
    defaultpassword: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Fetch student details on component mount
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) {
        setError('Student ID is required');
        setFetchLoading(false);
        return;
      }

      try {
        setFetchLoading(true);
        const studentData: StudentDetails = await getStudentDetails(studentId);
        
        setForm({
          student_id: studentData.student_id,
          name: studentData.name,
          branch: studentData.branch,
          batch: studentData.batch,
          program: studentData.program,
          school: studentData.school,
          defaultpassword: '', // Don't pre-fill password for security
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch student details';
        setError(errorMessage);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!form.defaultpassword) {
      setError('Password is required for security verification');
      return;
    }

    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await updateStudent(form);
      setSuccessMsg('Student details updated successfully! 🎉');
      
      // Clear password field after successful update
      setForm({ ...form, defaultpassword: '' });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update student'
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="update-student-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading student details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="update-student-container">
      <header className="update-student-header">
        <button onClick={() => navigate('/student-search')} className="back-btn">
          ← Back to Search
        </button>
        <h2>Update Student Details</h2>
        <p>Student ID: <strong>{form.student_id}</strong></p>
      </header>

      <form className="student-update-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="student_id">Student ID</label>
            <input
              id="student_id"
              name="student_id"
              type="text"
              value={form.student_id}
              disabled
              className="readonly"
            />
            <small>Student ID cannot be changed</small>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="branch">Branch</label>
            <input
              id="branch"
              name="branch"
              type="text"
              value={form.branch}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="batch">Batch</label>
            <input
              id="batch"
              name="batch"
              type="text"
              value={form.batch}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="program">Program</label>
            <input
              id="program"
              name="program"
              type="text"
              value={form.program}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="school">School</label>
            <input
              id="school"
              name="school"
              type="text"
              value={form.school}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group password-group">
          <label htmlFor="defaultpassword">New Password</label>
          <input
            id="defaultpassword"
            name="defaultpassword"
            type="password"
            value={form.defaultpassword}
            onChange={handleChange}
            placeholder="Enter new password for the student"
            required
          />
          <small>Enter a new password to update student's credentials</small>
        </div>

        {error && <div className="form-error">{error}</div>}
        {successMsg && <div className="form-success">{successMsg}</div>}

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/student-search')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateStudent;
