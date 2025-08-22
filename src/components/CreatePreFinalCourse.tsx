import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createPreFinalCourse, CreateCourseInput } from "../utils/api";
import "./CreateCourse.css";

const initialState: CreateCourseInput = {
  course_code: "",
  course_name: "",
  school: "",
  lecture: 0,
  tutorial: 0,
  practical: 0,
  credits: 0,
};

const CreateCourse: React.FC = () => {
  const [form, setForm] = useState<CreateCourseInput>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createPreFinalCourse(form);
      setSuccess("Course created!");
      setForm(initialState);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-container">
      <header>
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
        <h2>Create a Course</h2>
      </header>
      
      <form className="course-form" onSubmit={handleSubmit}>
        {[
          { label: "Course Code", name: "course_code" },
          { label: "Course Name", name: "course_name" },
          { label: "School", name: "school" },
          { label: "Credits", name: "credits", type: "number", min: 0 },
          { label: "Lecture", name: "lecture", type: "number", min: 0 },
          { label: "Tutorial", name: "tutorial", type: "number", min: 0 },
          { label: "Practical", name: "practical", type: "number", min: 0 },
        ].map((field) => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              value={form[field.name as keyof CreateCourseInput]}
              onChange={handleChange}
              type={field.type || "text"}
              min={field.min}
              disabled={loading}
            />
          </div>
        ))}
        
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
