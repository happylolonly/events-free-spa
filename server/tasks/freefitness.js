import cron from 'node-cron';

import axios from 'axios';

export default () => {
  cron.schedule('0 0 12 * * *', async () => {
    console.log('start free fitness');
    console.log('running a task every day at 12 pm');

    await axios.get('https://free-fitness-platform.herokuapp.com/api/check');
    axios.get('https://free-fitness-platform.herokuapp.com/api/check-reposts');
  });
};
