import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { feedbackAPI } from '../services/api';

// SVG Icon components
const Icons = {
  Android: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#3DDC84">
      <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-1.44-.59-3.05-.9-4.72-.9s-3.28.31-4.72.9L5.15 5.67c-.18-.28-.54-.37-.83-.22-.31.16-.42.54-.26.85L5.9 9.48C2.86 11.12.89 14.1.89 17.5h22.22c0-3.4-1.97-6.38-5.01-8.02zM7.1 14.5c-.61 0-1.1-.5-1.1-1.1s.49-1.1 1.1-1.1 1.1.5 1.1 1.1-.5 1.1-1.1 1.1zm9.8 0c-.61 0-1.1-.5-1.1-1.1s.49-1.1 1.1-1.1 1.1.5 1.1 1.1-.5 1.1-1.1 1.1z"/>
    </svg>
  ),
  Apple: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  ),
  Web: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  Hash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
  Folder: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Chat: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Bell: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Feedback: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Bug: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9V6M12 18v-3M9 12H6M18 12h-3M7.05 7.05 4.93 4.93M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12M19.07 19.07l-2.12-2.12" />
    </svg>
  ),
  Idea: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
    </svg>
  ),
  Sparkles: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
};

// Custom Dropdown Component
const CustomSelect = ({ value, onChange, options, placeholder, error, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="custom-select" ref={dropdownRef}>
      <button
        type="button"
        className={`custom-select-trigger ${error ? 'has-error' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="custom-select-value">
          {selectedOption ? (
            <>
              <span className="option-icon">{selectedOption.icon}</span>
              {selectedOption.label}
            </>
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </span>
        <span className={`custom-select-arrow ${isOpen ? 'open' : ''}`}>
          <Icons.ChevronDown />
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul 
            className="custom-select-options"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={`custom-select-option ${value === option.value ? 'selected' : ''}`}
                onClick={() => {
                  onChange({ target: { name, value: option.value } });
                  setIsOpen(false);
                }}
              >
                <span className="option-icon">{option.icon}</span>
                {option.label}
                {value === option.value && (
                  <span className="option-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <circle cx="12" cy="12" r="4" fill="currentColor" />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const AddFeedbackPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    created_by: '',
    platform: '',
    module: '',
    status: '',
    description: '',
    attachments: '',
    tags: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const platformOptions = [
    { value: 'Android', label: 'Android', icon: <Icons.Android /> },
    { value: 'iOS', label: 'iOS', icon: <Icons.Apple /> },
    { value: 'Web', label: 'Web', icon: <Icons.Web /> }
  ];

  const moduleOptions = [
    { value: 'Channel', label: 'Channel', icon: <Icons.Hash /> },
    { value: 'Project', label: 'Project', icon: <Icons.Folder /> },
    { value: 'Tasks', label: 'Tasks', icon: <Icons.Check /> },
    { value: 'Chat', label: 'Chat', icon: <Icons.Chat /> },
    { value: 'Alert', label: 'Alert', icon: <Icons.Bell /> }
  ];

  const statusOptions = [
    { value: 'New', label: 'New', icon: <span className="status-dot status-new"></span> },
    { value: 'In-Progress', label: 'In-Progress', icon: <span className="status-dot status-progress"></span> },
    { value: 'In Review', label: 'In Review', icon: <span className="status-dot status-review"></span> }
  ];

  const pageVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  const formContainerVariants = {
    hidden: { y: 10, scale: 0.98, opacity: 0 },
    show: {
      y: 0,
      scale: 1,
      opacity: 1,
      transition: { duration: 0.2, staggerChildren: 0.05 }
    },
    exit: { y: 10, scale: 0.98, opacity: 0, transition: { duration: 0.2 } }
  };
  const formListVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.04 } }
  };
  const formItemVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.created_by.trim()) {
      newErrors.created_by = 'Name is required';
    }
    
    if (!formData.platform.trim()) {
      newErrors.platform = 'Platform is required';
    }
    
    if (!formData.module.trim()) {
      newErrors.module = 'Module is required';
    }
    
    if (!formData.status.trim()) {
      newErrors.status = 'Status is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleTagClick = (tag) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newSelectedTags);
    setFormData({
      ...formData,
      tags: newSelectedTags.join(', '),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      await feedbackAPI.create(formData);
      navigate('/');
    } catch (err) {
      alert('Failed to create feedback. Please try again.');
      console.error('Error creating feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const attachmentSrc = formData.attachments.trim()
    ? (formData.attachments.startsWith('http') || formData.attachments.startsWith('/')
        ? formData.attachments
        : `/${formData.attachments}`)
    : '';
  const isAttachmentImage = attachmentSrc && /\.(png|jpe?g|gif|svg)$/i.test(attachmentSrc);

  return (
    <motion.div
      className="modal-page"
      variants={pageVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <motion.div className="form-container" variants={formContainerVariants}>
        <motion.div className="form-header" variants={formItemVariants}>
          <h2 className="form-title">Bug Report</h2>
          <button
            type="button"
            className="form-close"
            onClick={() => navigate('/')}
            aria-label="Close form"
          >
            <Icons.Close />
          </button>
        </motion.div>
        
        <motion.form
          onSubmit={handleSubmit}
          className="form-scroll"
          variants={formListVariants}
        >
        <motion.div className="form-group" variants={formItemVariants}>
          <label htmlFor="title" className="form-label">
            <span className="label-icon label-icon-title" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="12" r="4" />
                <circle cx="8" cy="12" r="1.5" fill="currentColor" />
                <line x1="14" y1="12" x2="21" y2="12" />
              </svg>
            </span>
            Title<span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Title"
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </motion.div>

        <motion.div className="form-group" variants={formItemVariants}>
          <label htmlFor="created_by" className="form-label">
            <span className="label-icon label-icon-user" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            Name<span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="created_by"
            name="created_by"
            value={formData.created_by}
            onChange={handleChange}
            className="form-input"
            placeholder="Your name"
          />
          {errors.created_by && <div className="error-message">{errors.created_by}</div>}
        </motion.div>

        <motion.div className="form-group" variants={formItemVariants}>
          <label htmlFor="platform" className="form-label">
            <span className="label-icon label-icon-platform" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="7" y="2" width="10" height="20" rx="2" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
            </span>
            Platform
          </label>
          <CustomSelect
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            options={platformOptions}
            placeholder="Select the platform"
            error={errors.platform}
          />
          {errors.platform && <div className="error-message">{errors.platform}</div>}
        </motion.div>

        <motion.div className="form-group" variants={formItemVariants}>
          <label htmlFor="module" className="form-label">
            <span className="label-icon label-icon-module" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </span>
            Module
          </label>
          <CustomSelect
            name="module"
            value={formData.module}
            onChange={handleChange}
            options={moduleOptions}
            placeholder="Select the module"
            error={errors.module}
          />
          {errors.module && <div className="error-message">{errors.module}</div>}
        </motion.div>

        <motion.div className="form-group" variants={formItemVariants}>
          <label htmlFor="status" className="form-label">
            <span className="label-icon label-icon-status" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 16 14" />
              </svg>
            </span>
            Status
          </label>
          <CustomSelect
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
            placeholder="Select the status"
            error={errors.status}
          />
          {errors.status && <div className="error-message">{errors.status}</div>}
        </motion.div>

        <motion.div className="form-group" variants={formItemVariants}>
          <label htmlFor="description" className="form-label">
            <span className="label-icon label-icon-description" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="14" y2="18" />
              </svg>
            </span>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Add additional details here"
            rows="5"
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </motion.div>

        <motion.div className="form-group" variants={formItemVariants}>
          <label htmlFor="attachments" className="form-label">
            <span className="label-icon label-icon-attachments" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15V7a5 5 0 0 0-10 0v10a3 3 0 0 0 6 0V9" />
              </svg>
            </span>
            Attachments (Optional)
          </label>
          <input
            type="text"
            id="attachments"
            name="attachments"
            value={formData.attachments}
            onChange={handleChange}
            className="form-input"
            placeholder="Upload image or video"
          />
          {isAttachmentImage && (
            <div className="attachment-preview">
              <img src={attachmentSrc} alt="Attachment preview" />
            </div>
          )}
        </motion.div>

        <motion.div className="form-group" variants={formItemVariants}>
          <label className="form-label">
            <span className="label-icon label-icon-tags" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="9" x2="19" y2="9" />
                <line x1="5" y1="15" x2="19" y2="15" />
                <line x1="9" y1="5" x2="9" y2="19" />
                <line x1="15" y1="5" x2="15" y2="19" />
              </svg>
            </span>
            Tags
          </label>
          <div className="tag-buttons">
            <motion.button
              type="button"
              className={`tag-button tag-feedback ${selectedTags.includes('Feedback') ? 'active' : ''}`}
              onClick={() => handleTagClick('Feedback')}
              aria-pressed={selectedTags.includes('Feedback')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icons.Feedback /> Feedback
            </motion.button>
            <motion.button
              type="button"
              className={`tag-button tag-bug ${selectedTags.includes('Bug Report') ? 'active' : ''}`}
              onClick={() => handleTagClick('Bug Report')}
              aria-pressed={selectedTags.includes('Bug Report')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icons.Bug /> Bug Report
            </motion.button>
            <motion.button
              type="button"
              className={`tag-button tag-idea ${selectedTags.includes('Idea') ? 'active' : ''}`}
              onClick={() => handleTagClick('Idea')}
              aria-pressed={selectedTags.includes('Idea')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icons.Idea /> Idea
            </motion.button>
            <motion.button
              type="button"
              className={`tag-button tag-feature ${selectedTags.includes('Feature Request') ? 'active' : ''}`}
              onClick={() => handleTagClick('Feature Request')}
              aria-pressed={selectedTags.includes('Feature Request')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icons.Sparkles /> Feature Request
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="form-buttons" variants={formItemVariants}>
          <motion.button
            type="submit"
            className="btn btn-submit"
            disabled={submitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  </motion.div>
  );
};

export default AddFeedbackPage;
