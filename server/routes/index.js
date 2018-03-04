export default (app) => {

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/../static/build/index.html');
  });

  require('./events')(app);
  require('./feedback')(app);
  require('./moderate')(app);

}
