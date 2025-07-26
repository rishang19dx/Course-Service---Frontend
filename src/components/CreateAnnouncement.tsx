import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAnnouncement, getSessionToken } from '../utils/api';
import './CreateAnnouncement.css';

const CreateAnnouncement: React.FC = () => {
  const navigate = useNavigate();
  const [announcementText, setAnnouncementText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const adminId = getSessionToken();
  const wordCount = announcementText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = announcementText.length;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!announcementText.trim()) {
      setError('Announcement text is required');
      return;
    }

    if (announcementText.trim().length < 10) {
      setError('Announcement must be at least 10 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await createAnnouncement(announcementText.trim());
      setSuccessMsg('Announcement posted successfully! 📢');
      setAnnouncementText('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to post announcement';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnnouncementText(e.target.value);
    // Clear error when user starts typing
    if (error) setError('');
    if (successMsg) setSuccessMsg('');
  };

  return (
    <div className="announcement-container">
      <header className="announcement-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <div className="header-content">
          <h2>Post New Announcement</h2>
          <p>Share important information with all students and faculty</p>
          <div className="admin-info">
            <span>Posting as: <strong>Admin</strong></span>
          </div>
        </div>
      </header>

      <main className="announcement-main">
        <div className="announcement-form-container">
          <form onSubmit={handleSubmit} className="announcement-form">
            <div className="form-group">
              <label htmlFor="announcement">Announcement Content</label>
              <textarea
                id="announcement"
                value={announcementText}
                onChange={handleTextChange}
                placeholder="Enter your announcement here... 

Example:
🎓 Important Notice: Final examinations for the current semester will begin from December 15th, 2024. 

📚 Students are advised to:
- Check the examination schedule on the official portal
- Bring valid ID cards to the examination hall
- Report any issues to the academic office

For queries, contact: academics@iitmandi.ac.in"
                className={error ? 'error' : ''}
                disabled={loading}
                rows={12}
              />
              <div className="text-stats">
                <span className={charCount > 1000 ? 'warning' : ''}>
                  {charCount} characters
                </span>
                <span>•</span>
                <span>{wordCount} words</span>
                {charCount > 1000 && (
                  <span className="warning-text">Consider shortening for better readability</span>
                )}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMsg && <div className="success-message">{successMsg}</div>}

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading || !announcementText.trim()}
              >
                {loading ? 'Posting...' : 'Post Announcement'}
              </button>
            </div>
          </form>
          {/* <div className="announcement-guidelines">
            <h4>📝 Announcement Guidelines</h4>
            <ul>
              <li>Keep announcements clear and concise</li>
              <li>Include relevant dates, times, and contact information</li>
              <li>Use emojis sparingly for better readability</li>
              <li>Double-check all details before posting</li>
              <li>For urgent matters, consider additional communication channels</li>
            </ul>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default CreateAnnouncement;
