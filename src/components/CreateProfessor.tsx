import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createProfessor, CreateProfessorRequest } from "../utils/api";
import "./Professor.css";

const initialState: CreateProfessorRequest = {
  prof_name: "",
  prof_email: "",
  prof_passed: "",
  school: "",
};

const CreateProfessor: React.FC = () => {
  const [form, setForm] = useState<CreateProfessorRequest>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createProfessor(form);
      setSuccess("Professor created successfully!");
      setForm(initialState);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="professor-container">
      <header className="professor-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
        <h2>Create Professor</h2>
      </header>

      <form className="professor-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="prof_name">Professor Name</label>
          <input
            id="prof_name"
            name="prof_name"
            value={form.prof_name}
            onChange={handleChange}
            type="text"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="prof_email">Email</label>
          <input
            id="prof_email"
            name="prof_email"
            value={form.prof_email}
            onChange={handleChange}
            type="email"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="prof_passed">Password</label>
          <input
            id="prof_passed"
            name="prof_passed"
            value={form.prof_passed}
            onChange={handleChange}
            type="password"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="school">School</label>
          <select
            id="school"
            name="school"
            value={form.school}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select School</option>
            <option value="SET">SCEE</option>
            <option value="SBS">SCENE</option>
            <option value="SSH">SMSS</option>
          </select>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating..." : "Create Professor"}
        </button>
      </form>
    </div>
  );
};

export default CreateProfessor;
