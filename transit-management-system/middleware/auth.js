const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

exports.adminAuth = (req, res, next) => {
  exports.auth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: Admin privileges required' });
    }
    next();
  });
};

exports.driverAuth = (req, res, next) => {
  exports.auth(req, res, () => {
    if (req.user.role !== 'driver' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: Driver privileges required' });
    }
    next();
  });
};