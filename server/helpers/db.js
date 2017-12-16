import config from '../configs';


export default (mongoose, callback) => {

  mongoose.connect(config.db.url);
  mongoose.connection
     .once('open', () => {
       callback();
     })
     .on('error', (error) => {
       console.log('Db connect error: \n', error);
     });

};
