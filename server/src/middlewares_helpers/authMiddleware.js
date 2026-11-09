const authModel = require('../models/authModel');

const getBearerToken = (req) => {
  const match = /^Bearer\s+(\S+)$/i.exec(req.headers.authorization || '');
  return match ? match[1] : null;
};

const requireAuth = (req, res, next) => {
  const token = getBearerToken(req);

  if (!token || !authModel.isValidToken(token)) {
    return res
      .status(401)
      .json({ success: false, message: 'Token tidak valid' });
  }

  req.token = token;
  next();
};

module.exports = { requireAuth };
