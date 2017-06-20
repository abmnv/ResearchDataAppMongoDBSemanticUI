const mongoose = require('mongoose');
const fsp = require('fs-promise');

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

  projectObj.files = files;

  return projectObj;
}

ProjectSchema.method('toClient', function() {
  //console.log('ProjectSchema.method this:', this);
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;

  delete obj.__v;

  const newFiles = obj.files.map((file) => {
    file.id = file._id;
    delete file._id;

    delete file.projectId;

    return file;
  });

  obj.files = newFiles;

  //console.log('ProjectSchema.method obj:', obj);
  return obj;
});

ProjectSchema.pre('save', function(next) {
  if(this.isNew) {
    // console.log('inside pre save');
    // console.log('this:', this);

    if(this.logoImage.name){
      //const newPath = `./public/data/${this._id}/${this.logo.name}`;
      fsp.mkdirp(`./public/data/${this._id}`).then(() => {
      //   console.log('created dir:', `./public/${projectId}`);
        return fsp.rename(this.logoImage.url, `./public/data/${this._id}/${this.logoImage.name}`);
      }).then(() => {
        this.logoImage.url = `/data/${this._id}/${this.logoImage.name}`;
        next();
      }).catch((err) => {
        next(new Error(err));
      });
    }else{
      this.logoImage = {
        name: 'default-project.png',
        url: '/images/default-project.png'
      }
      next();
    }
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
})

const Project = mongoose.model('Project', ProjectSchema);

module.exports = {Project};
