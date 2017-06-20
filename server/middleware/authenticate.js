const {User} = require('../models/User');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if(!user){
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((err) => {
    res.status(401).send(err);
  });
}

const authAdmin = (req, res, next) => {
  if(!req.user.admin){
    res.status(401).send('You don\'t have admin privilege');
  }

  next();
}

module.exports = {authenticate, authAdmin};
