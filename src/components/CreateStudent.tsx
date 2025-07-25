import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStudent, CreateStudentRequest } from '../utils/api';
import './CreateStudent.css';

const CreateStudent: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateStudentRequest>({
    student_id: '',
    name: '',
    branch: '',
    batch: '',
    program: '',
    school: '',
    defaultpassword: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await createStudent(form);
      setSuccessMsg('Student created successfully 🎉');
      setForm({
        student_id: '',
        name: '',
        branch: '',
        batch: '',
        program: '',
        school: '',
        defaultpassword: '',
        email: '',
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create student'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-student-container">
      <header className="create-student-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        <h2>Create New Student</h2>
      </header>

      <form className="student-form" onSubmit={handleSubmit}>
        {[
          { label: 'Student ID', name: 'student_id' },
          { label: 'Full Name', name: 'name' },
          { label: 'Branch', name: 'branch' },
          { label: 'Batch', name: 'batch' },
          { label: 'Program', name: 'program' },
          { label: 'School', name: 'school' },
          { label: 'Email', name: 'email', type: 'email' },
          {
            label: 'Default Password',
            name: 'defaultpassword',
            type: 'password',
          },
        ].map((field) => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              type={field.type || 'text'}
              value={(form as any)[field.name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {error && <div className="form-error">{error}</div>}
        {successMsg && <div className="form-success">{successMsg}</div>}

        <button className="submit-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Student'}
        </button>
      </form>
    </div>
  );
};

export default CreateStudent;
