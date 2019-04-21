const mongoose = require('mongoose');
const User = mongoose.model('User');

// log in as a brand new user every time the test suite runs
module.exports = () => {
  // async action
  return new User({}).save();
};
