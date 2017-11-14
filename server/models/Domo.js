const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

// mongoose.Types.ObjectID is a function that converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  weight: {
    type: Number,
    min: 0,
    required: true,
  },

  createData: {
    type: Date,
    default: Date.now(),
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return DomoModel.find(search).select('name age weight').exec(callback);
};

DomoSchema.statics.delete = (id, name, callback) => {
  const search = {
    owner: convertID(id),
    name,
  };
  return DomoModel.deleteOne(search).exec(callback);
};

DomoSchema.statics.change = (id, oldname, name, age, weight, callback) => {
  const search = {
    owner: convertID(id),
    name: oldname,
  };

  const change = {};
  const set = {};


  if (name !== '') {
    set.name = name;
  }
  if (age !== '') {
    set.age = age;
  }
  if (weight !== '') {
    set.weight = weight;
  }

  change.$set = set;

  return DomoModel.update(search, change).exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
