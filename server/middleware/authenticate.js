const {User} = require('../models/User');
const {Project} = require('../models/Project');

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
  if(req.user.role !== 'admin'){
    res.status(401).send('You don\'t have admin privilege');
  }else{
    next();
  }
}

const authManagerOrAdmin = (req, res, next) => {
  if(req.user.role === 'user'){
    res.status(401).send('You don\'t have admin privilege');
  }else{
    next();
  }
}

const authAllowedManagerOrAdmin = (req, res, next) => {
  const user = req.user;
  const projectId = req.params.projectId;

  if(user.role === 'user'){
    res.status(401).send('You don\'t have admin privilege');
  }else if(user.role === 'manager'){
    const project = Project.findById(projectId).then((project) => {
      if(!project){
        return Promise.reject('NotFound');
      }
      
      let allowed = false;
      project.managers.forEach((userId) => {
        if(user._id.toHexString() === userId){
          allowed = true;
        }
      });

      if(!allowed){
        return Promise.reject('You don\'t have permission to edit this project');
      }else{
        next();
      }
    }).catch((err) => {
      if(err.message === 'NotFound'){
        return res.status(404).send();
      }
      res.status(400).send(err);
    });
  }else if(role === 'admin'){
    next()
  }
}

module.exports = {authenticate, authAdmin, authManagerOrAdmin, authAllowedManagerOrAdmin};
