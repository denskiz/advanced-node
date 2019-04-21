const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

// export a new function which takes a user model
// call this function when ever we want to create a new session
module.exports = user => {
  const sessionObject = {
    passport: {
      // mongoose model id is not actually a string its a object
      user: user._id.toString()
    }
  };
  const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
  const sig = keygrip.sign('session=' + session);

  return { session, sig };
};
