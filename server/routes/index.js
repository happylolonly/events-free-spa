export default (app) => {

  app.get('/', (req, res, next) => {
    // if (req.originalUrl.slice(-1) != '/') return next();
    res.sendFile(__dirname + '/../static/build/index.html');
  });

  app.get('/.well-known/acme-challenge/*', (req, res, next) => {
    // if (req.originalUrl.slice(-1) != '/') return next();
    res.send(200);
    // res.sendFile(__dirname + '/../static/build/index.html');
  });

  require('./events')(app);
  require('./feedback')(app);
  require('./moderate')(app);

}
