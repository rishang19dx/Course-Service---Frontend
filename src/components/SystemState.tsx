import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSystemState, changeSystemState, StateType } from "../utils/api";
import "./SystemState.css";

const stateLabels = {
  [StateType.COURSE_FINALIZATION]: "Course Finalization",
  [StateType.PRE_REGISTRATION]: "Pre-Registration",
  [StateType.REGISTRATION]: "Registration"
};

const stateDescriptions = {
  [StateType.COURSE_FINALIZATION]: "Courses are being finalized by administration",
  [StateType.PRE_REGISTRATION]: "Students can pre-register for courses",
  [StateType.REGISTRATION]: "Students can complete final registration"
};

const stateColors = {
  [StateType.COURSE_FINALIZATION]: "#f59e0b",
  [StateType.PRE_REGISTRATION]: "#3b82f6", 
  [StateType.REGISTRATION]: "#10b981"
};

const SystemState: React.FC = () => {
  const [currentState, setCurrentState] = useState<StateType | null>(null);
  const [selectedState, setSelectedState] = useState<StateType | null>(null);
  const [loading, setLoading] = useState(false);
  const [changing, setChanging] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentState();
  }, []);

  const fetchCurrentState = async () => {
    try {
      setLoading(true);
      setError("");
      const state = await getSystemState();
      setCurrentState(state.sysState);
      setSelectedState(state.sysState);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load system state");
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = async () => {
    if (!selectedState || selectedState === currentState) return;

    try {
      setChanging(true);
      setError("");
      setSuccess("");
      
      await changeSystemState(selectedState);
      setCurrentState(selectedState);
      setSuccess(`System state changed to ${stateLabels[selectedState]}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change system state");
      setSelectedState(currentState); // Reset selection on error
    } finally {
      setChanging(false);
    }
  };

  if (loading) {
    return (
      <div className="system-state-container">
        <div className="loading-state">Loading system state...</div>
      </div>
    );
  }

  return (
    <div className="system-state-container">
      <header className="system-state-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
        <h2>System State Management</h2>
      </header>

      {error && <div className="state-error">{error}</div>}
      {success && <div className="state-success">{success}</div>}

      <div className="current-state-section">
        <h3>Current System State</h3>
        {currentState && (
          <div 
            className="current-state-badge" 
            style={{ backgroundColor: stateColors[currentState] }}
          >
            <div className="state-name">{stateLabels[currentState]}</div>
            <div className="state-desc">{stateDescriptions[currentState]}</div>
          </div>
        )}
      </div>

      <div className="change-state-section">
        <h3>Change System State</h3>
        <div className="state-options">
          {Object.values(StateType).map((state) => (
            <div key={state} className="state-option">
              <input
                type="radio"
                id={state}
                name="systemState"
                value={state}
                checked={selectedState === state}
                onChange={() => setSelectedState(state)}
                disabled={changing}
              />
              <label htmlFor={state} className="state-label">
                <div className="state-label-name">{stateLabels[state]}</div>
                <div className="state-label-desc">{stateDescriptions[state]}</div>
              </label>
            </div>
          ))}
        </div>

        <button
          className="change-state-btn"
          onClick={handleStateChange}
          disabled={changing || !selectedState || selectedState === currentState}
        >
          {changing ? "Changing..." : "Change State"}
        </button>
      </div>

      <div className="state-info">
        <h4>State Information</h4>
        <ul>
          <li><strong>Course Finalization:</strong> Administrators are setting up and finalizing course offerings</li>
          <li><strong>Pre-Registration:</strong> Students can browse and pre-register for available courses</li>
          <li><strong>Registration:</strong> Students can complete their final course registration</li>
        </ul>
      </div>
    </div>
  );
};

export default SystemState;
