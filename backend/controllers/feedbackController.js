const { query } = require('../config/database');
const { logActivity } = require('../utils/logger');

// Get all feedbacks
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await query('SELECT * FROM feedbacks ORDER BY created_at DESC');
    await logActivity('FETCH_ALL_FEEDBACKS', `Retrieved ${feedbacks.length} feedbacks`);
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};

// Get single feedback by ID
exports.getFeedbackById = async (req, res) => {
  const { id } = req.params;

  try {
    const feedbacks = await query('SELECT * FROM feedbacks WHERE id = ?', [id]);
    
    if (feedbacks.length === 0) {
      await logActivity('FETCH_FEEDBACK_NOT_FOUND', `Feedback ID ${id} not found`);
      return res.status(404).json({ error: 'Feedback not found' });
    }

    await logActivity('FETCH_FEEDBACK', `Retrieved feedback ID ${id}`);
    res.json(feedbacks[0]);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};

// Create new feedback
exports.createFeedback = async (req, res) => {
  const { title, platform, module, description, attachments, tags, status, created_by } = req.body;

  // Validation
  if (!title || !platform || !module || !description || !status || !created_by) {
    return res.status(400).json({ error: 'Title, platform, module, description, status, and name are required' });
  }

  try {
    const result = await query(
      'INSERT INTO feedbacks (title, platform, module, description, attachments, tags, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, platform, module, description, attachments || '', tags || '', status, created_by]
    );

    const newFeedback = {
      id: result.insertId,
      title,
      platform,
      module,
      description,
      attachments: attachments || '',
      tags: tags || '',
      status,
      votes: 0,
      created_by
    };

    await logActivity('CREATE_FEEDBACK', `Created new feedback: ${title}`);
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
};

// Update feedback
exports.updateFeedback = async (req, res) => {
  const { id } = req.params;
  const { title, platform, module, description, attachments, tags, status, created_by } = req.body;

  // Validation
  if (!title || !platform || !module || !description || !status || !created_by) {
    return res.status(400).json({ error: 'Title, platform, module, description, status, and name are required' });
  }

  try {
    const result = await query(
      'UPDATE feedbacks SET title = ?, platform = ?, module = ?, description = ?, attachments = ?, tags = ?, status = ?, created_by = ? WHERE id = ?',
      [title, platform, module, description, attachments || '', tags || '', status, created_by, id]
    );

    if (result.affectedRows === 0) {
      await logActivity('UPDATE_FEEDBACK_NOT_FOUND', `Feedback ID ${id} not found for update`);
      return res.status(404).json({ error: 'Feedback not found' });
    }

    await logActivity('UPDATE_FEEDBACK', `Updated feedback ID ${id}: ${title}`);
    res.json({ id, title, platform, module, description, attachments, tags, status, created_by });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM feedbacks WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      await logActivity('DELETE_FEEDBACK_NOT_FOUND', `Feedback ID ${id} not found for deletion`);
      return res.status(404).json({ error: 'Feedback not found' });
    }

    await logActivity('DELETE_FEEDBACK', `Deleted feedback ID ${id}`);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
};

// Upvote feedback
exports.upvoteFeedback = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query(
      'UPDATE feedbacks SET votes = votes + 1 WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    const feedbacks = await query('SELECT votes FROM feedbacks WHERE id = ?', [id]);
    await logActivity('UPVOTE_FEEDBACK', `Upvoted feedback ID ${id}`);
    res.json({ votes: feedbacks[0].votes });
  } catch (error) {
    console.error('Error upvoting feedback:', error);
    res.status(500).json({ error: 'Failed to upvote feedback' });
  }
};

// Downvote feedback
exports.downvoteFeedback = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query(
      'UPDATE feedbacks SET votes = CASE WHEN votes > 0 THEN votes - 1 ELSE 0 END WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    const feedbacks = await query('SELECT votes FROM feedbacks WHERE id = ?', [id]);
    await logActivity('DOWNVOTE_FEEDBACK', `Downvoted feedback ID ${id}`);
    res.json({ votes: feedbacks[0].votes });
  } catch (error) {
    console.error('Error downvoting feedback:', error);
    res.status(500).json({ error: 'Failed to downvote feedback' });
  }
};
