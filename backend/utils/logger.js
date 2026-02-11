const { query } = require('../config/database');

// Log activity to logs table
exports.logActivity = async (activity, details = '') => {
  try {
    await query(
      'INSERT INTO logs (activity, details) VALUES (?, ?)',
      [activity, details]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Track API request/response
exports.trackAPI = async (endpoint, method, requestBody, statusCode, responseBody) => {
  try {
    await query(
      'INSERT INTO api_tracking (api_endpoint, request_method, request_body, response_status, response_body) VALUES (?, ?, ?, ?, ?)',
      [endpoint, method, JSON.stringify(requestBody), statusCode, JSON.stringify(responseBody)]
    );
  } catch (error) {
    console.error('Error tracking API:', error);
  }
};

// Get all logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await query('SELECT * FROM logs ORDER BY date_time DESC');
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};

// Get API tracking data
exports.getAPITracking = async (req, res) => {
  try {
    const tracking = await query('SELECT * FROM api_tracking ORDER BY date_time DESC');
    res.json(tracking);
  } catch (error) {
    console.error('Error fetching API tracking:', error);
    res.status(500).json({ error: 'Failed to fetch API tracking' });
  }
};
