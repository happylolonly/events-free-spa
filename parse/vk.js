import VK from 'vk-io';
import moment from 'moment';
import chrono from 'chrono-node';

import credentials from '../credentials';

import { saveEventItemToDB, convertMonths, formatDate, sliceText, checkText } from './helpers';


const { app, key, token } = credentials.vk;
const vk = new VK({
  app: app,
  key: key,
  token: token,
});

const init = (group) => {
  vk.api.wall.search({
    domain: group,
    query: `${moment().locale('ru').format('MMMM')}`,
    count: 100,
  })
  .then(wall => {
    // console.log('Wall:', wall);

    const results = [];

    wall.items.forEach(item => {
      const { from_id, id } = item;
      let { text, attachments } = item;

      // вложенный пост
      if (!text) {
        text = item.copy_history[0].text;
        attachments = item.copy_history[0].attachments;
      };

      // const index = text.indexOf(`${moment().locale('ru').format('MMMM')}`);
      // while (text.indexOf('.') >= 0 ) {
      //   text = text.replace('.', ':');
      // }
      // console.log(text);
      // console.log(chrono.parse(convertMonths(text))[0]);

      // если нету даты в тексте
      if (!chrono.parse(convertMonths(text))[0]) return;

      const parsedDate = chrono.parse(convertMonths(text))[0].start.knownValues;
      // console.log(parsedDate);

      const { day, month } = parsedDate;
      if (!day) {
        console.log(chrono.parse(convertMonths(text))[0]);
        console.log('--------');
        console.log(item.text);
        console.log(parsedDate);
        console.log('------------');
      };
      let hour;
      let minute;
      let year = moment().format('YYYY');

      const date = formatDate(year, month, day, hour, minute);


      results.push({
        date: date,
        title: sliceText(item.text, 15),
        text: item.text,
        images: [ attachments[0].photo && attachments[0].photo.photo_604 ],
        originalLink: `?w=wall${from_id}_${id}`,
        source: `vk.com/${group}`,
        status: checkText(text) ? 'active' : 'noactive',
      });
    });

    // saveEventItemToDB(results);
    console.log('here');
  })
  .catch(error => {
    console.error(error);
  });
}

export default { init };
