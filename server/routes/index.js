export default (app) => {

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/../build');
  });

  require('./events')(app);
  require('./feedback')(app);
  require('./moderate')(app);

}
