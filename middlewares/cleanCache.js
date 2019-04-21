const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  // allow route handler to run, then run the middleware
  await next();

  clearHash(req.user.id);
};
