export default (app) => {

  app.get('/', (req, res, next) => {
    console.log('in /');

    // if (req.originalUrl.slice(-1) != '/') return next();
    res.sendFile(__dirname + '/../static/build/index.html');
  });

  app.get('/.well-known/acme-challenge/xQdTA59CaQG_x9AHRq-dvlrAAjOL-YY3Mt5NCecMVZU', (req, res, next) => {
    // if (req.originalUrl.slice(-1) != '/') return next();
    res.send('xQdTA59CaQG_x9AHRq-dvlrAAjOL-YY3Mt5NCecMVZU.tKO74Kllpv1GZuYljudpZVhj20FvA6m05c86Ik4tUF0');
    // res.sendFile(__dirname + '/../static/build/index.html');
  });

  app.get('/.well-known/acme-challenge/c_A1t5KhFcu7ygW8xvQ1qtFRBM84SR3YfvNm5a58HTg', (req, res, next) => {
    // if (req.originalUrl.slice(-1) != '/') return next();
    res.send('c_A1t5KhFcu7ygW8xvQ1qtFRBM84SR3YfvNm5a58HTg.tKO74Kllpv1GZuYljudpZVhj20FvA6m05c86Ik4tUF0');
    // res.sendFile(__dirname + '/../static/build/index.html');
  });

  require('./events')(app);
  require('./feedback')(app);
  require('./moderate')(app);
  require('./logs')(app);

}
