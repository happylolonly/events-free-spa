export default (app) => {

  app.get('/', (req, res, next) => {
    // if (req.originalUrl.slice(-1) != '/') return next();
    res.sendFile(__dirname + '/../static/build/index.html');
  });

  app.get('/.well-known/acme-challenge/*', (req, res, next) => {
    // if (req.originalUrl.slice(-1) != '/') return next();
    res.send('xQdTA59CaQG_x9AHRq-dvlrAAjOL-YY3Mt5NCecMVZU.tKO74Kllpv1GZuYljudpZVhj20FvA6m05c86Ik4tUF0');
    // res.sendFile(__dirname + '/../static/build/index.html');
  });

  require('./events')(app);
  require('./feedback')(app);
  require('./moderate')(app);

}
