export default (app) => {
  require('./events')(app);
  require('./feedback')(app);
  require('./moderate')(app);
  require('./logs')(app);
}
