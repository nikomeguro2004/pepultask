import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { feedbackAPI } from '../services/api';

// SVG Icon components
const Icons = {
  DotsVertical: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  ),
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  ChevronUp: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Bug: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9V6M12 18v-3M9 12H6M18 12h-3M7.05 7.05 4.93 4.93M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12M19.07 19.07l-2.12-2.12" />
    </svg>
  ),
  Sparkles: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" />
      <path d="M19 13l.5 1.5L21 15l-1.5.5L19 17l-.5-1.5L17 15l1.5-.5L19 13z" />
    </svg>
  ),
  Zap: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Mobile: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  ),
  Monitor: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  Hash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
  Chat: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Plus: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const MotionLink = motion(Link);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const pageVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } }
  };
  const emptyStateVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } }
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await feedbackAPI.getAll();
        setFeedbacks(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch feedbacks. Please try again.');
        console.error('Error fetching feedbacks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
    
    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.feedback-actions')) {
        setOpenMenuId(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [location.key]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await feedbackAPI.delete(deleteId);
      setFeedbacks(feedbacks.filter(feedback => feedback.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      alert('Failed to delete feedback. Please try again.');
      console.error('Error deleting feedback:', err);
    }
  };

  const handleUpvote = async (id, event) => {
    event.stopPropagation();
    try {
      const response = await feedbackAPI.upvote(id);
      setFeedbacks(feedbacks.map(feedback => 
        feedback.id === id ? { ...feedback, votes: response.data.votes } : feedback
      ));
    } catch (err) {
      console.error('Error upvoting feedback:', err);
    }
  };

  const handleDownvote = async (id, event) => {
    event.stopPropagation();
    try {
      const response = await feedbackAPI.downvote(id);
      setFeedbacks(feedbacks.map(feedback => 
        feedback.id === id ? { ...feedback, votes: response.data.votes } : feedback
      ));
    } catch (err) {
      console.error('Error downvoting feedback:', err);
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    const normalized = status.toLowerCase();
    if (normalized === 'in-progress') return { text: 'In-Progress', class: 'badge-inprogress' };
    if (normalized === 'new') return { text: 'New', class: 'badge-new' };
    if (normalized === 'in review') return { text: 'In Review', class: 'badge-inreview' };
    return null;
  };

  const getTypeBadge = (tags) => {
    if (!tags) return null;
    const lowerTags = tags.toLowerCase();
    if (lowerTags.includes('bug')) return { text: 'Bug report', icon: Icons.Bug, class: 'badge-bug' };
    if (lowerTags.includes('feature')) return { text: 'Feature Request', icon: Icons.Sparkles, class: 'badge-feature' };
    if (lowerTags.includes('idea')) return { text: 'Idea', icon: Icons.Zap, class: 'badge-idea' };
    return null;
  };

  const getUserInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return <div className="loading">Loading feedbacks...</div>;
  }

  if (error) {
    return <div className="error-alert">{error}</div>;
  }

  return (
    <motion.div initial="hidden" animate="show" variants={pageVariants}>
      {feedbacks.length === 0 ? (
        <motion.div className="empty-state" variants={emptyStateVariants}>
          <h2>No Feedbacks Yet</h2>
          <p>Start by adding your first feedback!</p>
          <Link to="/add" className="btn btn-primary">
            + Add Feedback
          </Link>
        </motion.div>
      ) : (
        <motion.div
          className="feedback-list"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence>
            {feedbacks.map((feedback) => {
            const statusBadge = getStatusBadge(feedback.status);
            const typeBadge = getTypeBadge(feedback.tags);
            const userName = feedback.created_by || '';
            const userInitials = getUserInitials(userName);
            const displayPlatform = feedback.platform === 'Android' || feedback.platform === 'iOS'
              ? 'Mobile'
              : feedback.platform;
            
            return (
              <motion.div
                key={feedback.id}
                className="feedback-card"
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="feedback-header">
                  <div className="user-info">
                    {userInitials && <div className="user-avatar">{userInitials}</div>}
                    <h3 className="feedback-title">{feedback.title}</h3>
                  </div>
                  
                  <div className="feedback-right">
                    <div className="feedback-votes-container">
                      <button
                        type="button"
                        className="vote-btn vote-up"
                        onClick={(e) => handleUpvote(feedback.id, e)}
                        aria-label={`Upvote ${feedback.title}`}
                      >
                        <Icons.ChevronUp />
                      </button>
                      <div className="votes-info">
                        <span className="votes-count">{feedback.votes || 0}</span>
                        <span className="votes-label">Votes</span>
                      </div>
                      <button
                        type="button"
                        className="vote-btn vote-down"
                        onClick={(e) => handleDownvote(feedback.id, e)}
                        aria-label={`Downvote ${feedback.title}`}
                      >
                        <Icons.ChevronDown />
                      </button>
                    </div>

                    <div className="feedback-actions">
                      <button 
                        className="action-menu-btn"
                        onClick={() => setOpenMenuId(openMenuId === feedback.id ? null : feedback.id)}
                      >
                        <Icons.DotsVertical />
                      </button>
                      <AnimatePresence>
                        {openMenuId === feedback.id && (
                          <motion.div
                            className="action-menu"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15 }}
                          >
                          <button 
                            className="action-menu-item"
                            onClick={() => {
                              navigate(`/edit/${feedback.id}`, {
                                state: { backgroundLocation: location }
                              });
                              setOpenMenuId(null);
                            }}
                          >
                            <Icons.Edit /> Edit List
                          </button>
                          <button 
                            className="action-menu-item delete"
                            onClick={() => handleDeleteClick(feedback.id)}
                          >
                            <Icons.Trash /> Delete List
                          </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                
                <p className="feedback-description">{feedback.description}</p>
                
                <div className="feedback-meta">
                  {userName && (
                    <span className="user-badge">
                      <div className="user-avatar-small">{userInitials}</div>
                      <span className="user-name">{userName}</span>
                    </span>
                  )}
                  
                  {statusBadge && (
                    <span className={`meta-badge ${statusBadge.class}`}>
                      {statusBadge.text}
                    </span>
                  )}
                  
                  {typeBadge && (
                    <span className={`meta-badge ${typeBadge.class}`}>
                      <typeBadge.icon /> {typeBadge.text}
                    </span>
                  )}
                  
                  {feedback.platform && (
                    <span className="meta-badge badge-platform">
                      {feedback.platform === 'Web' ? <Icons.Monitor /> : <Icons.Mobile />} {displayPlatform}
                    </span>
                  )}
                  
                  {feedback.module && (
                    <span className="meta-badge badge-module">
                      {feedback.module === 'Chat' ? <Icons.Chat /> : <Icons.Hash />} {feedback.module}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </motion.div>
      )}

      <MotionLink
        to="/add"
        state={{ backgroundLocation: location }}
        className="add-feedback-btn"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="add-icon"><Icons.Plus /></span>
        Feedback
      </MotionLink>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="modal-overlay"
            onClick={() => setShowDeleteModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="modal-title">Delete Feedback?</h2>
              <p className="modal-text">Are you sure want to delete the feedback.</p>
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-delete" 
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HomePage;
