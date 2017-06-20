const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
  admin: {
    type: Boolean,
    default: false
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
    'admin': decoded.admin
  });
}

UserSchema.statics.findByCredentials = function(email, password) {
  const User = this;

  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject('Email is not found');
    }

    return bcrypt.compare(password, user.password).then((res) => {
      if(res){
        return user;
      }else{
        return Promise.reject('Password does not match');
      }
    });
  });
}

UserSchema.methods.toJSON = function() {
  const user = this;

  //const userObj = user.toObject();

  return {id: user._id, email: user.email, admin: user.admin}
}

UserSchema.methods.genAuthToken = function() {
  const user = this;

  const access = 'auth';

  const token = jwt.sign({
    id: user._id.toHexString(),
    email: user.email,
    admin: user.admin,
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
