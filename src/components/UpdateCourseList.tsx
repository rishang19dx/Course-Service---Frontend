import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCoursesByCode, deleteCourseAdmin } from "../utils/api";
import "./UpdateCourse.css";

export default function UpdateCourseList() {
  const { courseCode } = useParams();
  const [courses, setCourses] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (courseCode) {
      getCoursesByCode(courseCode)
        .then((res) => setCourses(res.courses))
        .catch((err) => alert(err.message));
    }
  }, [courseCode]);

  const handleDelete = async (course_id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourseAdmin(course_id);
      setCourses((prev) => prev.filter((c) => c.course_id !== course_id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="course-list-container">
      <h2>Courses for code: {courseCode}</h2>
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <table className="course-table">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Name</th>
              <th>School</th>
              <th>Credits</th>
              <th>Slot</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.course_id}>
                <td>{c.course_id}</td>
                <td>{c.course_name}</td>
                <td>{c.school}</td>
                <td>{c.credits}</td>
                <td>{c.slot}</td>
                <td>
                  <button onClick={() => navigate(`/edit-course/${c.course_id}`)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(c.course_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
