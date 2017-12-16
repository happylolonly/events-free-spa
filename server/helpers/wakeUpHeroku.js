
import axios from 'axios';

const wakeUpHeroku = () => {
  axios.get('https://eventsfree.herokuapp.com')
    .then(data => {
      console.log('all ok');
    })
    .catch(error => {
      console.log('some error');
    })
}

setTimeout(() => {
  console.log('check wake up');
  wakeUpHeroku();

}, 60*1000);

cron.schedule('* 10 * * * *', () => {
  console.log('schedule wake up');
  wakeUpHeroku();
});
