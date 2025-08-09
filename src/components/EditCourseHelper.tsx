import React, { useEffect, useState } from "react";
import {
  fetchHelpers,
  addHelper,
  updateHelper,
  deleteHelper,
} from "../utils/api";
import "./EditCourseHelpers.css";

export interface UICourseHelper {
  course_helper_uid: string; // unique id for the helper row
  course_id: string;
  branch: string;
  program: string;
  course_type: string;
  semester: string;
  year: string;
  slot?: string;
}

const EMPTY: Omit<UICourseHelper, "course_helper_uid"> = {
  course_id: "",
  branch: "",
  program: "",
  course_type: "",
  semester: "",
  year: "",
  slot: "",
};

const TYPE_VALUES = ["IC", "DC", "DE", "FE", "HSS"];
const SEMESTERS = ["even", "odd"];

const EditCourseHelpers: React.FC = () => {
  const [courseId, setCourseId] = useState<string>("");
  const [helpers, setHelpers] = useState<UICourseHelper[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [newHelper, setNewHelper] = useState<Omit<UICourseHelper, "course_helper_uid">>(EMPTY);

  const [editHelper, setEditHelper] = useState<Record<
    string,
    Partial<Omit<UICourseHelper, "course_helper_uid">>
  >>({});

  useEffect(() => {
    if (!courseId.trim()) return;
    setLoading(true);
    setError("");
    setMsg("");
    fetchHelpers(courseId.trim())
      .then((res) => {
        // Map backend "uid" field to course_helper_uid for UI
        const mapped: UICourseHelper[] = res.helpers.map((h: any) => ({
          course_helper_uid: h.uid,
          course_id: h.course_id,
          branch: h.branch,
          program: h.program,
          course_type: h.course_type,
          semester: h.semester,
          year: h.year,
          slot: h.slot,
        }));
        setHelpers(mapped);
      })
      .catch((e) => setError(e.message || "Failed to fetch helpers"))
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMsg("");
    const { branch, program, course_type, semester, year } = newHelper;
    if (!branch || !program || !course_type || !semester || !year) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      await addHelper({ ...newHelper, course_code: courseId });
      setMsg("Helper added successfully.");
      setNewHelper({ ...EMPTY, course_id: courseId });
      const refreshed = await fetchHelpers(courseId);
      const mapped: UICourseHelper[] = refreshed.helpers.map((h: any) => ({
        course_helper_uid: h.uid,
        course_id: h.course_id,
        branch: h.branch,
        program: h.program,
        course_type: h.course_type,
        semester: h.semester,
        year: h.year,
        slot: h.slot,
      }));
      setHelpers(mapped);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add helper");
    }
  };

  const handleUpdate = async (courseHelperUid: string) => {
    setError("");
    setMsg("");
    const changes = editHelper[courseHelperUid];
    if (!changes || Object.keys(changes).length === 0) {
      setError("No changes to save.");
      return;
    }
    try {
      await updateHelper({ course_helper_uid: courseHelperUid, ...changes });
      setMsg("Helper updated successfully.");
      setEditHelper((prev) => ({ ...prev, [courseHelperUid]: {} }));
      const refreshed = await fetchHelpers(courseId);
      const mapped: UICourseHelper[] = refreshed.helpers.map((h: any) => ({
        course_helper_uid: h.uid,
        course_id: h.course_id,
        branch: h.branch,
        program: h.program,
        course_type: h.course_type,
        semester: h.semester,
        year: h.year,
        slot: h.slot,
      }));
      setHelpers(mapped);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update helper");
    }
  };

  const handleDelete = async (courseHelperUid: string) => {
    setError("");
    setMsg("");
    if (!window.confirm("Delete this helper?")) return;
    try {
      await deleteHelper(courseHelperUid);
      setMsg("Helper deleted successfully.");
      const refreshed = await fetchHelpers(courseId);
      const mapped: UICourseHelper[] = refreshed.helpers.map((h: any) => ({
        course_helper_uid: h.uid,
        course_id: h.course_id,
        branch: h.branch,
        program: h.program,
        course_type: h.course_type,
        semester: h.semester,
        year: h.year,
        slot: h.slot,
      }));
      setHelpers(mapped);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete helper");
    }
  };

  return (
    <div className="edit-coursehelpers-container">
      <header>
        <h2>Edit Course Helpers (per branch/program)</h2>
        <p>
          Manage permitted branches and programs for a course.
          <br />
          Enter the <strong>Course ID</strong> below (example: IC-101)
        </p>
      </header>

      <form className="course-id-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Course ID"
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value);
            setHelpers([]);
            setError("");
            setMsg("");
          }}
          required
          style={{ marginRight: 12, minWidth: 240 }}
        />
      </form>

      {loading && <div className="loading">Loading...</div>}

      {courseId && (
        <>
          <h3>Existing Helpers</h3>
          <div style={{ overflowX: "auto" }}>
            <table className="helpers-table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Program</th>
                  <th>Type</th>
                  <th>Semester</th>
                  <th>Year</th>
                  <th>Slot</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {helpers.map((helper) => {
                  const isEditing =
                    editHelper[helper.course_helper_uid] &&
                    Object.keys(editHelper[helper.course_helper_uid]).length > 0;

                  return (
                    <tr key={helper.course_helper_uid}>
                      {isEditing ? (
                        <>
                          <td>
                            <input
                              value={editHelper[helper.course_helper_uid]?.branch ?? helper.branch}
                              onChange={(e) =>
                                setEditHelper((prev) => ({
                                  ...prev,
                                  [helper.course_helper_uid]: {
                                    ...prev[helper.course_helper_uid],
                                    branch: e.target.value,
                                  },
                                }))
                              }
                            />
                          </td>
                          <td>
                            <input
                              value={editHelper[helper.course_helper_uid]?.program ?? helper.program}
                              onChange={(e) =>
                                setEditHelper((prev) => ({
                                  ...prev,
                                  [helper.course_helper_uid]: {
                                    ...prev[helper.course_helper_uid],
                                    program: e.target.value,
                                  },
                                }))
                              }
                            />
                          </td>
                          <td>
                            <select
                              value={editHelper[helper.course_helper_uid]?.course_type ?? helper.course_type}
                              onChange={(e) =>
                                setEditHelper((prev) => ({
                                  ...prev,
                                  [helper.course_helper_uid]: {
                                    ...prev[helper.course_helper_uid],
                                    course_type: e.target.value,
                                  },
                                }))
                              }
                            >
                              <option value="" disabled>
                                Choose type
                              </option>
                              {TYPE_VALUES.map((val) => (
                                <option key={val} value={val}>
                                  {val}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <select
                              value={editHelper[helper.course_helper_uid]?.semester ?? helper.semester}
                              onChange={(e) =>
                                setEditHelper((prev) => ({
                                  ...prev,
                                  [helper.course_helper_uid]: {
                                    ...prev[helper.course_helper_uid],
                                    semester: e.target.value,
                                  },
                                }))
                              }
                            >
                              <option value="" disabled>
                                Choose semester
                              </option>
                              {SEMESTERS.map((val) => (
                                <option key={val} value={val}>
                                  {val}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              value={editHelper[helper.course_helper_uid]?.year ?? helper.year}
                              onChange={(e) =>
                                setEditHelper((prev) => ({
                                  ...prev,
                                  [helper.course_helper_uid]: {
                                    ...prev[helper.course_helper_uid],
                                    year: e.target.value,
                                  },
                                }))
                              }
                            />
                          </td>
                          <td>
                            <input
                              value={editHelper[helper.course_helper_uid]?.slot ?? helper.slot}
                              onChange={(e) =>
                                setEditHelper((prev) => ({
                                  ...prev,
                                  [helper.course_helper_uid]: {
                                    ...prev[helper.course_helper_uid],
                                    slot: e.target.value,
                                  },
                                }))
                              }
                            />
                          </td>
                          <td>
                            <button
                              onClick={() => handleUpdate(helper.course_helper_uid)}
                              disabled={loading}
                            >
                              Save
                            </button>
                            <button
                              onClick={() =>
                                setEditHelper((prev) => ({
                                  ...prev,
                                  [helper.course_helper_uid]: {},
                                }))
                              }
                              disabled={loading}
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{helper.branch}</td>
                          <td>{helper.program}</td>
                          <td>{helper.course_type}</td>
                          <td>{helper.semester}</td>
                          <td>{helper.year}</td>
                          <td>{helper.slot}</td>
                          <td>
                            <button
                              onClick={() =>
                                setEditHelper((prev) => ({
                                  ...prev,
                                  [helper.course_helper_uid]: { ...helper },
                                }))
                              }
                              disabled={loading}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(helper.course_helper_uid)}
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}

                <tr>
                  <td>
                    <input
                      value={newHelper.branch}
                      onChange={(e) =>
                        setNewHelper((prev) => ({ ...prev, branch: e.target.value }))
                      }
                      placeholder="Branch"
                    />
                  </td>
                  <td>
                    <input
                      value={newHelper.program}
                      onChange={(e) =>
                        setNewHelper((prev) => ({ ...prev, program: e.target.value }))
                      }
                      placeholder="Program"
                    />
                  </td>
                  <td>
                    <select
                      value={newHelper.course_type}
                      onChange={(e) =>
                        setNewHelper((prev) => ({ ...prev, course_type: e.target.value }))
                      }
                    >
                      <option value="">Choose Type</option>
                      {TYPE_VALUES.map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={newHelper.semester}
                      onChange={(e) =>
                        setNewHelper((prev) => ({ ...prev, semester: e.target.value }))
                      }
                    >
                      <option value="">Choose Semester</option>
                      {SEMESTERS.map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      value={newHelper.year}
                      onChange={(e) =>
                        setNewHelper((prev) => ({ ...prev, year: e.target.value }))
                      }
                      placeholder="Year"
                    />
                  </td>
                  <td>
                    <input
                      value={newHelper.slot}
                      onChange={(e) =>
                        setNewHelper((prev) => ({ ...prev, slot: e.target.value }))
                      }
                      placeholder="Slot"
                    />
                  </td>
                  <td>
                    <button onClick={handleAdd} disabled={loading}>
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {error && <div className="error-message">{error}</div>}
      {msg && <div className="success-message">{msg}</div>}
    </div>
  );
};

export default EditCourseHelpers;
