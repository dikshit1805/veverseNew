const Proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/recommendations',
    Proxy({
      target: "https://veverse.uc.r.appspot.com/",
      changeOrigin: true,
    })
  );
};