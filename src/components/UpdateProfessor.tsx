import React, { useEffect, useState, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfessorById, updateProfessor, Professor } from "../utils/api";
import "./Professor.css";

const UpdateProfessor: React.FC = () => {
  const { professorId } = useParams<{ professorId: string }>();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (professorId) {
      fetchProfessor(professorId);
    }
  }, [professorId]);

  const fetchProfessor = async (iid: string) => {
    try {
      setLoading(true);
      const result = await getProfessorById(iid);
      setProfessor(result.professor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load professor");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (professor) {
      setProfessor({ ...professor, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!professor) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateProfessor(professor);
      setSuccess("Professor updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update professor");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !professor) {
    return <div className="professor-container">Loading...</div>;
  }

  if (!professor) {
    return <div className="professor-container">Professor not found</div>;
  }

  return (
    <div className="professor-container">
      <header className="professor-header">
        <button className="back-btn" onClick={() => navigate("/professor-search")}>
          ← Back
        </button>
        <h2>Update Professor</h2>
      </header>

      <form className="professor-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="prof_name">Professor Name</label>
          <input
            id="prof_name"
            name="prof_name"
            value={professor.prof_name}
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
            value={professor.prof_email}
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
            value={professor.prof_passed}
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
            value={professor.school}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select School</option>
            <option value="SET">School of Engineering & Technology</option>
            <option value="SBS">School of Basic Sciences</option>
            <option value="SSH">School of Social Sciences & Humanities</option>
          </select>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Updating..." : "Update Professor"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfessor;
