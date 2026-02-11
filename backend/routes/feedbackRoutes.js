const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { getLogs, getAPITracking } = require('../utils/logger');
const apiTracker = require('../middleware/apiTracker');

// Apply API tracker middleware to all routes
router.use(apiTracker);

// Feedback routes
router.get('/feedbacks', feedbackController.getAllFeedbacks);
router.post('/feedbacks', feedbackController.createFeedback);
router.get('/feedbacks/:id', feedbackController.getFeedbackById);
router.put('/feedbacks/:id', feedbackController.updateFeedback);
router.delete('/feedbacks/:id', feedbackController.deleteFeedback);
router.post('/feedbacks/:id/upvote', feedbackController.upvoteFeedback);
router.post('/feedbacks/:id/downvote', feedbackController.downvoteFeedback);

// Logs and tracking routes
router.get('/logs', getLogs);
router.get('/api-tracking', getAPITracking);

module.exports = router;
