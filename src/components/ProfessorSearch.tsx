import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchProfessorByEmail } from "../utils/api";
import "./Professor.css";

const ProfessorSearch: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const result = await searchProfessorByEmail(email);
      navigate(`/update-professor/${result.professor.iid}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Professor not found");
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
        <h2>Search Professor</h2>
      </header>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="email">Professor Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter professor email to search"
            required
            disabled={loading}
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="submit-btn" disabled={loading || !email.trim()}>
          {loading ? "Searching..." : "Search Professor"}
        </button>
      </form>
    </div>
  );
};

export default ProfessorSearch;
