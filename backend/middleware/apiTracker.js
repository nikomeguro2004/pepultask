const { trackAPI } = require('../utils/logger');

// Middleware to track all API requests and responses
const apiTracker = (req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;

  let responseBody;

  res.send = function (data) {
    responseBody = data;
    originalSend.call(this, data);
  };

  res.json = function (data) {
    responseBody = data;
    originalJson.call(this, data);
  };

  res.on('finish', async () => {
    try {
      await trackAPI(
        req.originalUrl || req.url,
        req.method,
        req.body || {},
        res.statusCode,
        responseBody || {}
      );
    } catch (error) {
      console.error('Error in API tracking middleware:', error);
    }
  });

  next();
};

module.exports = apiTracker;
