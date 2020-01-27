const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.get('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.SECRET);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authenicated' });
  }
};
