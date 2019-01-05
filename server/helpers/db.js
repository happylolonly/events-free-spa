import config from '../configs';

export default (mongoose, callback) => {
  mongoose.Promise = global.Promise;

  mongoose.connect(
    config.db.url,
    { useMongoClient: true }
  );
  mongoose.connection
    .once('open', () => {
      callback();
    })
    .on('error', error => {
      console.log('Db connect error: \n', error);
    });
};
