const mongoose = require('mongoose');
const fsp = require('fs-promise');
const validator = require('validator');

const Schema = mongoose.Schema;

const FileSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  url: {
    type: String,
    required: true,
    minlength: 1
  },
  projectId: {
    type: String,
    required: true,
    minlength: 1
  },
});

FileSchema.methods.toJSON = function() {
  const userObj = this.toObject();

  userObj.id = userObj._id;
  delete userObj._id;
  delete userObj.projectId;

  return userObj;
}

FileSchema.method('toClient', function(){
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;

  delete obj.projectId;

  return obj;
});

FileSchema.pre('save', function (next) {

  if(this.isNew) {
    //const newPath = `./public/data/${this.projectId}/${this.name}`;

    fsp.mkdirp(`./public/data/${this.projectId}`).then(() => {
    //   console.log('created dir:', `./public/${projectId}`);
      return fsp.rename(this.url, `./public/data/${this.projectId}/${this._id}`);
    }).then(() => {
      this.url = `/data/${this.projectId}/${this._id}`;
      next();
    }).catch((err) => {
      next(new Error(err));
    })
  }else{
    next();
  }
});

//pre remove hook didn't work with callback functions.
FileSchema.post('remove', function(doc) {
  fsp.remove(`./public${doc.url}`).then(() => {
    console.log('removed file:', `./public${doc.url}`);
  }).catch((err) => {
    console.log('Error File post remove', err);
  });
});

// FileSchema.pre('remove', function(next) {
//
//   setTimeout(function () {
//       console.log('mock removed file:', `./public${this.url}`);
//     next();
//   }, 1000);
//   // fsp.remove(`./public${this.url}`).then(() => {
//   //   console.log('removed file:', `./public${this.url}`);
//   //   next();
//   // }).catch((err) => {
//   //   console.log('Error File pre remove', err);
//   //   next(new Error(err));
//   // });
// })

const DUARequestSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  institution: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'pending'
  }
});

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  createdAt: {
    type: Number,
    required: true
  },
  logoImage: {
    name: {
      type: String,
      required: false,
      // minlength: 0
    },
    url: {
      type: String,
      required: false,
      // minlength: 0
    }
  },
  requiresPermission: {
    type: Boolean,
    required: true
  },
  dua: {
    type: String,
    //required: false,
    default: '',
    // minlength: 1,
    trim: true
  },
  managers: [{
    type: String,
    unique: true
  }],
  allowedUsers: [{
    type: String,
    unique: true
  }],
  DUARequests: [DUARequestSchema],
  files: [FileSchema]
});

ProjectSchema.methods.toJSON = function() {
  const projectObj = this.toObject();

  projectObj.id = projectObj._id;
  delete projectObj._id;
  delete projectObj.__v;

  const files = projectObj.files.map((file) => {
    file.id = file._id;

    delete file._id;
    delete file.projectId;

    return file;
  });

  const DUARequests = projectObj.DUARequests.map((doc) => {
    doc.id = doc._id;
    delete doc._id;

    return doc;
  });

  projectObj.DUARequests = DUARequests;
  projectObj.files = files;

  return projectObj;
}

// ProjectSchema.method('toClient', function() {
//   //console.log('ProjectSchema.method this:', this);
//   const obj = this.toObject();
//
//   obj.id = obj._id;
//   delete obj._id;
//   delete obj.__v;
//
//   const newFiles = obj.files.map((file) => {
//     file.id = file._id;
//     delete file._id;
//
//     delete file.projectId;
//
//     return file;
//   });
//
//   obj.files = newFiles;
//
//   //console.log('ProjectSchema.method obj:', obj);
//   return obj;
// });

ProjectSchema.methods.updateLogoImage = function(logoImage) {
  const project = this;

  //remove the old one
  return fsp.remove(`./public${project.logoImage.url}`).then(() => {
    //console.log('removed file:', `./public${project.logoImage.url}`);
    //copy from /upload to /public/data directory
    const newPath = `/data/${project._id}/${logoImage.name}`;
    project.logoImage.name = logoImage.name;
    project.logoImage.url = newPath;
    return fsp.rename(logoImage.url, `./public${newPath}`);
  }).then(() => {
    // console.log('uploadLogoImage then');
    return project.save();
  }).catch((err) => {
    return Promise.reject(err);
  });
}

ProjectSchema.pre('save', function(next) {
  if(this.isNew) {
    // console.log('inside pre save');
    // console.log('this:', this);

    // if(this.logoImage.name){
    //const newPath = `./public/data/${this._id}/${this.logo.name}`;
    fsp.mkdirp(`./public/data/${this._id}`).then(() => {
      //   console.log('created dir:', `./public/${projectId}`);
      if(this.logoImage.name){
        return fsp.rename(this.logoImage.url, `./public/data/${this._id}/${this.logoImage.name}`);
      }else{
        this.logoImage = {
          name: 'default-project.png',
          url: 'public/images/default-project.png'
        }
        //console.log('ProjectSchema.pre', this.logoImage);
        return fsp.createReadStream(this.logoImage.url).pipe(fsp.createWriteStream(`./public/data/${this._id}/${this.logoImage.name}`));
      }
    }).then(() => {
      this.logoImage.url = `/data/${this._id}/${this.logoImage.name}`;
      next();
    }).catch((err) => {
      next(new Error(err));
    });
    // }else{
    //   this.logoImage = {
    //     name: 'default-project.png',
    //     url: '/images/default-project.png'
    //   }
    //   next();
    // }
  }else{
    next();
  }
});

ProjectSchema.pre('remove', function(next) {
  fsp.remove(`./public/data/${this._id}`).then(() => {
    console.log('Remove directory:', `./public/data/${this._id}`);
    next();
  }).catch((err) => {
    next(new Error(err));
  });
});

ProjectSchema.statics.removeUsernameFromManagers = function(username){
  const Project = this;

  return Project.find({managers: username}).then((docs) => {
    docs.forEach((doc) => {
      doc.managers = doc.managers.filter((u) => {
        return u !== username;
      });
      doc.save();
    });
    // console.log('User', username, 'is a manger in following projects', docs);
  });
}

const Project = mongoose.model('Project', ProjectSchema);

module.exports = {Project};
