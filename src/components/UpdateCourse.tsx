import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { updateCourse, UpdateCourseInput } from "../utils/api";
import "./UpdateCourse.css";

const UpdateCourse: React.FC = () => {
  const [form, setForm] = useState<UpdateCourseInput>({
    course_id: "",
    course_code: "",
    course_name: "",
    school: "",
    slot: "",
    lecture: 0,
    tutorial: 0,
    practical: 0,
    credits: 0,
    status: true,
  });
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

  // All fields for update are optional, but course_id is required!
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.course_id) {
      setError("Course ID is required for update.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await updateCourse(form);
      setSuccess("Course updated!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-course-container">
      <header>
        <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back</button>
        <h2>Update Course</h2>
      </header>
      <form className="course-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="course_id">Course ID</label>
          <input
            id="course_id"
            name="course_id"
            value={form.course_id}
            onChange={handleChange}
            placeholder="Enter existing Course ID"
            required
            disabled={loading}
          />
        </div>
        {[
          { label: "Course Code", name: "course_code" },
          { label: "Course Name", name: "course_name" },
          { label: "School", name: "school" },
          { label: "Slot", name: "slot" },
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
              value={form[field.name as keyof UpdateCourseInput]}
              onChange={handleChange}
              type={field.type || "text"}
              min={field.min}
              disabled={loading}
            />
          </div>
        ))}
        <div className="form-group">
          <label htmlFor="status">Active?</label>
          <input
            id="status"
            name="status"
            type="checkbox"
            checked={!!form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.checked }))}
            disabled={loading}
          />
        </div>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Updating..." : "Update Course"}
        </button>
      </form>
    </div>
  );
};

export default UpdateCourse;
