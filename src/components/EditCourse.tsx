import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, updateCourseAdmin } from "../utils/api";
import "./UpdateCourse.css";

export default function EditCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (courseId) {
      getCourseById(courseId)
        .then((res) => setCourse(res.course))
        .catch((err) => alert(err.message));
    }
  }, [courseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCourseAdmin(course);
      alert("Course updated successfully!");
      navigate(`/update-course-list/${course.course_code}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="edit-course-container">
      <h2>Edit Course: {course.course_name}</h2>
      <form onSubmit={handleSubmit}>
        <input name="course_code" value={course.course_code} onChange={handleChange} placeholder="Course Code" />
        <input name="course_name" value={course.course_name} onChange={handleChange} placeholder="Course Name" />
        <input name="school" value={course.school} onChange={handleChange} placeholder="School" />
        <input type="number" name="lecture" value={course.lecture} onChange={handleChange} placeholder="Lecture" />
        <input type="number" name="tutorial" value={course.tutorial} onChange={handleChange} placeholder="Tutorial" />
        <input type="number" name="practical" value={course.practical} onChange={handleChange} placeholder="Practical" />
        <input type="number" name="credits" value={course.credits} onChange={handleChange} placeholder="Credits" />
        <input name="slot" value={course.slot} onChange={handleChange} placeholder="Slot" />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
