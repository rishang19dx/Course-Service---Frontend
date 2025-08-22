import React, { useEffect, useState } from 'react';
import {
  fetchProfCourseRequests,
  approveProfCourseReq,
  rejectProfCourseReq,
  ProfCourseReq
} from '../utils/api';
import './ProfCourseReq.css';

const statusBadge = (val: boolean | null) => {
  if (val === true) return <span className="badge approved">Approved</span>;
  if (val === false) return <span className="badge rejected">Rejected</span>;
  return <span className="badge pending">Pending</span>;
};

const ProfCourseRequests: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<ProfCourseReq[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchProfCourseRequests();
      setRequests(res.facultyRequests || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (request_id: string) => {
    try {
      await approveProfCourseReq(request_id);
      setRequests(prev =>
        prev.map(r => r.request_id === request_id ? { ...r, accept_reject: true } : r)
      );
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleReject = async (request_id: string) => {
    try {
      await rejectProfCourseReq(request_id);
      setRequests(prev =>
        prev.map(r => r.request_id === request_id ? { ...r, accept_reject: false } : r)
      );
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="prof-reqs-container">
      <div className="prof-reqs-header">
        <h2>Faculty Course Requests</h2>
        <button className="refresh-btn" onClick={load} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {loading && requests.length === 0 ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="prof-reqs-list">
          {requests.map(req => (
            <div className="prof-req-card" key={req.request_id}>
              <div className="prof-req-row">
                <div className="col">
                  <div className="label">Request ID</div>
                  <div className="value mono">{req.request_id}</div>
                </div>
                <div className="col">
                  <div className="label">Course Code</div>
                  <div className="value">{req.pre_final_course?.course_code || 'N/A'}</div>
                </div>
                <div className="col">
                  <div className="label">Course Name</div>
                  <div className="value">{req.pre_final_course?.course_name || 'N/A'}</div>
                </div>
                <div className="col status-col">
                  <div className="label">Status</div>
                  <div className="value">{statusBadge(req.accept_reject)}</div>
                </div>
              </div>

              <div className="prof-req-row">
                <div className="col">
                  <div className="label">Professor</div>
                  <div className="value">
                    {req.professor?.prof_name || req.iid}
                    <div className="sub">{req.professor?.prof_email}</div>
                  </div>
                </div>
                <div className="col">
                  <div className="label">School</div>
                  <div className="value">{req.professor?.school || '-'}</div>
                </div>
                <div className="col">
                  <div className="label">Requested Slot</div>
                  <div className="value">{req.slot}</div>
                </div>
                <div className="col">
                  <div className="label">Credits</div>
                  <div className="value">{req.pre_final_course?.credits || '-'}</div>
                </div>
              </div>

              <div className="prof-req-row">
                <div className="col">
                  <div className="label">Course School</div>
                  <div className="value">{req.pre_final_course?.school || '-'}</div>
                </div>
                {/* <div className="col">
                  <div className="label">Chairperson ID</div>
                  <div className="value mono">{req.chairperson_id}</div>
                </div> */}
                {/* <div className="col">
                  <div className="label">Pre-Final Course ID</div>
                  <div className="value mono">{req.pre_final_course_id}</div>
                </div> */}

                <div className="col actions-col">
                  <button
                    className="tick-btn"
                    title="Approve"
                    onClick={() => handleApprove(req.request_id)}
                    disabled={req.accept_reject === true}
                  >
                    ✓
                  </button>
                  <button
                    className="cross-btn"
                    title="Reject"
                    // onClick={() => handleReject(req.request_id)}
                    disabled={true}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfCourseRequests;
