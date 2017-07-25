const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    default: 'user'
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      requred: true
    }
  }]
});

UserSchema.statics.findByToken = function(token){
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return Promise.reject(err);
  }

  return User.findOne({
    '_id': decoded.id,
    'tokens.token': token,
    'tokens.access': decoded.access,
    'role': decoded.role
  });
}

UserSchema.statics.findByCredentials = function(username, password) {
  const User = this;

  return User.findOne({username}).then((user) => {
    if(!user){
      return Promise.reject('Username is not found');
    }

    return bcrypt.compare(password, user.password).then((res) => {
      if(res){
        return user;
      }else{
        return Promise.reject('Username/password do not match');
      }
    });
  });
}

UserSchema.methods.toJSON = function() {
  const user = this;

  //const userObj = user.toObject();
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  }
}

UserSchema.methods.genAuthToken = function() {
  const user = this;

  const access = 'auth';

  const token = jwt.sign({
    id: user._id.toHexString(),
    username: user.username,
    email: user.email,
    admin: user.admin,
    role: user.role,
    access
  }, process.env.JWT_SECRET).toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.deleteToken = function(token) {
  const user = this;

  return user.update({
    $pull: {
      tokens: {
        token
      }
    }
  });
}

UserSchema.pre('save', function(next) {
  const user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  }else{
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};
