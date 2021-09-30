
const jwt = require('jsonwebtoken');
const { KEY_JWT } = require('./constants');

const verifyJWT = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({auth: false, message: 'No token provided.'});
  }

  jwt.verify(token, KEY_JWT, function (err, decoded) {
    if (err) {
      return res
        .status(500)
        .json({auth: false, message: 'Failed to authenticate token.'});
    }

    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
}

const generateJWT = (userId) => {
  return jwt.sign({id: userId}, KEY_JWT, {
    expiresIn: 86400, // expires in 24 hours
  });
}

const getIdByToken = (req) => {
  const token = req.headers['x-access-token'];
  const decoded = jwt.verify(token, KEY_JWT);
  let userId = decoded.id || decoded.userId;
  return userId;
}

module.exports = {
  verifyJWT,
  generateJWT,
  getIdByToken,
};