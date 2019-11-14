const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(
      token,
      'THIS IS THE BIT THAT SHOULD BE IN AN ENV FILE SOMEWHERE',
      (err, decodedToken) => {
        if (err) {
          res.status(401).json({ message: 'bad token: ' + err.message})
        } else {
          req.decodedToken = decodedToken;
          next()
        }
      }
    )
  } else {
    res.status(400).json({ message: 'No credentials provided' });
  }
};
