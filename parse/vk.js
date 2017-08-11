import VK from 'vk-io';
import moment from 'moment';
import chrono from 'chrono-node';

import { saveEventItemToDB, convertMonths } from './helpers';

const vk = new VK({
  app: 6131483,
  key: 'f4vLOjoPyKSOw4qXgb6y',
  scope: 'all',
  token: 'b58844e3b58844e3b58844e34eb5d5cbf8bb588b58844e3ecf6456263d1070e24bb2a38',
});


const init = (group) => {

  vk.auth.server()
    .then(token => {
      console.log('Server token:',token);
      vk.setToken('b58844e3b58844e3b58844e34eb5d5cbf8bb588b58844e3ecf6456263d1070e24bb2a38');


      vk.api.wall.search({
          domain: group,
          query: `${moment().locale('ru').format('MMMM')}`,
          count: 100,
          'access_token': 'b58844e3b58844e3b58844e34eb5d5cbf8bb588b58844e3ecf6456263d1070e24bb2a38',
      })
      .then(wall => {
          // console.log('Wall:',wall);

          let results = [];

          wall.items.forEach((item, i) => {
            // console.log(item);



            const { from_id, id } = item;
            let { text } = item;
            if (!text) return;
            const index = text.indexOf(`${moment().locale('ru').format('MMMM')}`);
            // while (text.indexOf('.') >= 0 ) {
            //   text = text.replace('.', ':');
            // }
            console.log(text);
            // console.log(chrono.parse(convertMonths(text))[0]);

            if (!chrono.parse(convertMonths(text))[0]) return;

            const parsedDate = chrono.parse(convertMonths(text))[0].start.knownValues;
            console.log(parsedDate);

            const { day, month } = parsedDate;
            if (!day) return;
            let hour;
            let minute;

            let year = moment().format('YYYY');
            const date = Date.parse(moment(new Date(year, month - 1, day, hour || '', minute || '')).locale('ru'));

            // const month = moment().month('август').format("MM");
            // const date = Date.parse(`2017-${month}-${before}T00:00`);

            results.push({
              title: item.text.substring(0, 70) + '...',
              originalLink: `?w=wall${from_id}_${id}`,
              date: date,
              text: item.text,
              source: `vk.com/${group}`,
              images: [ item.attachments[0].photo && item.attachments[0].photo.photo_604 ],
            });
          });
          saveEventItemToDB(results);
      })
      .catch(error => {
          console.error(error);
      });
  })
  .catch(error => {
      console.error(error);
  });
}

export default { init };
