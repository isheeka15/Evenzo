const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'changeme', {
    expiresIn: '7d',
  });
};

module.exports = generateToken;
