module.exports = function RequestInformationMiddleware(req, res, next) {
  console.time('request');
  console.info(`Method: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd('request');
};
