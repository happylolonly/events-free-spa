import cron from 'node-cron';

import axios from 'axios';

export default () => {
  cron.schedule('0 0 12 * * *', () => {
    console.log('start train model');
    console.log('running a task every day at 12 pm');

    axios.get('https://eventsfree-ml.herokuapp.com/train');
  });
};
