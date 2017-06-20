const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
//const fsp = require('fs-promise');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const JSZip = require('jszip') ;
const {mongoose} = require('./db/mongoose');
const {Project} = require('./models/Project');
const {User} = require('./models/User');
const {authenticate, authAdmin} = require('./middleware/authenticate');

var path = require('path');
var env = require('node-env-file');

try {
  env('.env');
} catch(err) {
  console.log('Problem importing env file, ', err);
}

const app = express();
app.use(bodyParser.json());

const upload = multer({dest: './uploads/'});

app.get('/projects', (req, res) => {
  Project.find({}).then((docs) => {
    res.send(docs);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/projects/:projectId/files', (req, res) => {
  const projectId = req.params.projectId;
  console.log('query params:', req.query);

  Project.findById(projectId).then((project) => {

    if(!project){
      return Promise.reject('NotFound');
      //throw new Error('NotFound');
      //return new res.status(404).send();
    }

    const zip = new JSZip();

    req.query.id.forEach((id) => {
      const doc = project.files.id(id);
      console.log('doc:', doc);
      if(!doc){
        return Promise.reject('NotFound');
        //throw new Error('NotFound');
      }
      const path = './public' + doc.url;
      console.log('download path', path);

      zip.file(doc.name, fs.readFileSync(path));
    });


    res.setHeader('Content-disposition', 'attachment; filename=data.zip');
    res.setHeader('Content-Type', 'application/zip');
    //const data = zip.generate({ base64:false, compression: 'DEFLATE' });
    zip.generateNodeStream({type:'nodebuffer', streamFiles:true}).pipe(res);
    //res.download(dat, "data.zip");
  }).catch((err) => {
    if(err.message === 'NotFound'){
      return res.status(404).send();
    }
    res.status(400).send(err);
  });
});

app.get('/projects/:projectId/files/:fileId', authenticate, (req, res) => {
  const projectId = req.params.projectId;
  const fileId = req.params.fileId;

  Project.findById(projectId).then((project) => {

    if(!project){
      return Promise.reject('NotFound');
      //throw new Error('NotFound');
      //return new res.status(404).send();
    }
    //myProject = project;
    //console.log('project:', project);

    const doc = project.files.id(fileId);
    //console.log('inside findById doc:', doc);
    if(!doc){
      return Promise.reject('NotFound');
      //throw new Error('NotFound');
    }

    const path = './public' + doc.url;
    console.log('download path', path);
    res.download(path, doc.name);
  }).catch((err) => {
    if(err.message === 'NotFound'){
      return res.status(404).send();
    }
    res.status(400).send(err);
  });
});

app.post('/projects/:projectId/files', authenticate, authAdmin, upload.single('dataFiles'), (req, res) => {
  const projectId = req.params.projectId;

  if(!req.file){
    return res.status(400).send('Didn\'t find file in the request');
  }

  Project.findById(projectId).then((project) => {
    //console.log('project:', project);
    const file = req.file;
    //console.log('req.file:', req.file);
    //const path = `./public/${projectId}/${file.originalname}`;
    const doc = {name: file.originalname, url: file.path, projectId};
    project.files.push(doc);
    return project.save();
  }).then((doc) => {
    const file = doc.files[doc.files.length-1].toObject();
    file.id = file._id;

    delete file._id;
    delete file.projectId;

    res.send(file);
  }).catch((err) => {
    res.status(400).send(err);
  })
});

app.delete('/projects/:projectId/files/:fileId', authenticate, authAdmin, (req, res) => {
  const projectId = req.params.projectId;
  const fileId = req.params.fileId;
  //let fileDoc;
  //let myProject;
  let myDoc;

  Project.findById(projectId).then((project) => {

    if(!project){
      throw new Error('NotFound');
      //return new res.status(404).send();
    }
    //myProject = project;
    console.log('project:', project);

    myDoc = project.files.id(fileId);
    console.log('inside findById doc:', myDoc);
    if(!myDoc){
      throw new Error('NotFound');
    }

    //return project.files.pull(fileId);
    project.files.id(fileId).remove();
    return project.save();
  }).then((docs) => {
    res.send(myDoc);
  }).catch((err) => {
    if(err.message === 'NotFound'){
      return res.status(404).send();
    }
    res.status(400).send(err);
  });
});

app.patch('/projects/:projectId', authenticate, authAdmin, upload.array('dataFiles', 20), (req, res) => {
  //console.log('req.body:', req.body);
  const projectId = req.params.projectId;
  const body = _.pick(req.body, ['title', 'description']);
  //console.log('req.files:', req.files);

  Project.findByIdAndUpdate(req.params.projectId, {$set: body}, {new: true}).then((doc) => {
    if(!doc){
      return res.status(404).send();
    }
    res.send(doc.toClient());
  }).catch((err) => {
    res.status(400).send(err);
  });


  // Project.findById(projectId).then((project) => {
  //
  //   if(!project){
  //     //throw new Error('NotFound');
  //     return new res.status(404).send();
  //   }
  //
  //   for(let key in body){
  //     project[key] = body[key];
  //   }
  //
  //   if(req.files){
  //     req.files.forEach((file) => {
  //       project.files.push({name: file.originalname, url: file.path, projectId});
  //     });
  //   }
  //
  //   return project.save();
  // }).then((doc) => {
  //   res.send(doc.toClient());
  // }).catch((err) => {
  //   res.status(400).send(err);
  // });
});


app.delete('/projects/:projectId', authenticate, authAdmin, (req, res) => {
  //console.log('projectId:', req.params.projectId);
  Project.findByIdAndRemove(req.params.projectId).then((doc) => {
    //console.log('doc:', doc);
    if(!doc){
      return res.status(404).send();
    }
    //this is a hack because pre remove hook doesn't support query remove only document remove
    return doc.remove();
  }).then((doc) => {
    res.send(doc);
  }).catch((err) => {
    res.status(400).send(err);
  });
});


app.post('/projects', authenticate, authAdmin, upload.fields([{
  name: 'dataFiles',
  maxCount: 50
}, {
  name: 'logoImage',
  maxCount: 1
}]), (req, res) => {
  //console.log(req.body);
  //console.log(req.files.logo);

  const body = _.pick(req.body, ['title', 'description']);
  const project = new Project(body);
  project.createdAt = Math.floor((new Date().getTime())/1000);
  //console.log('project:', project);

  const projectId = project._id;

  if(req.files.dataFiles){
    req.files.dataFiles.forEach((file) => {
      project.files.push({name: file.originalname, url: file.path, projectId});
    });
  }

  if(req.files.logoImage){
    project.logoImage = {
      name: req.files.logoImage[0].originalname,
      url: req.files.logoImage[0].path
    };
  }else{
    project.logoImage = {
      name: null,
      url: null
    }
  }

  project.save().then((doc) => {
    res.send(doc.toClient());
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/users', authenticate, authAdmin, (req, res) => {
  User.find({}).then((docs) => {
    res.send(docs);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  //console.log('body:', body);

  const user = new User(body);
  //console.log('user:', user);

  user.save().then(() => {
    return user.genAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    //console.log('post err:', err);
    if(err.name = 'MongoError' && err.code === 11000){
      res.status(400).send({message: 'This email address is already used!'});
    }else{
      res.status(400).send(err);
    }
  });
});

app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.genAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((err) => {
    res.status(400).send({message: err});
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  const user = req.user;

  user.deleteToken(req.token).then(() => {
    res.send();
  }).catch(() => {
    res.status(400).send();
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
  console.log("Server started on port", PORT);
});
