import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UpdateCourse.css";

export default function UpdateCourse() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  return (
    <div className="update-course-container">
      <h2>Find Course to Update</h2>
      <input
        type="text"
        placeholder="Enter Course Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        onClick={() => {
          if (code.trim()) navigate(`/update-course-list/${code}`);
        }}
      >
        Search
      </button>
    </div>
  );
}
