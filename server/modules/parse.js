import cron from 'node-cron';
import moment from 'moment';
import Log from '../model/log';

import config from '../helpers/parse-config';

import meetupBy from '../parse/meetupBy';
import eventsDevBy from '../parse/eventsDevBy';
import imaguru from '../parse/imaguru';
import sportMts from '../parse/sportMts';
import tutby from '../parse/tutby';
import space from '../parse/space';
import htp from '../parse/htp';
import daonlp from '../parse/daonlp';
import citydogVedy from '../parse/citydogVedy';
import citydogAfisha from '../parse/citydogAfisha';
import vk from '../parse/vk';

function start(callback) {
  config.meetupBy && meetupBy.init();
  config.eventsDevBy && eventsDevBy.init();
  config.imaguru && imaguru.init();

  config.sportMts && sportMts.init();
  config.tutby && tutby.init();

  config.htp && htp.init();
  config.space && space.init();
  config.daonlp && daonlp.init();

  config.citydogAfisha && citydogAfisha.init();

  if (config.citydogVedy) {
    setTimeout(() => {
      // citydog blocks
      citydogVedy.init();
    }, 1000);
  }

  config.minskforfree && vk.init('minskforfree');
  config.freeFitnessMinsk && vk.init('free_fitness_minsk');
  config.freeLanguagesMinsk && vk.init('free_languages_minsk');

  setTimeout(() => {
    callback && callback();
  }, 1000 * 30);
}

// TODO: check this kostyl
let times = 0;
function init(callback) {
  start(callback);

  cron.schedule('0 */6 * * *', () => {
    console.log('running a task every 6 hour');

    times = times + 1;

    const log = new Log({
      date: moment().format('DD/MM/YYYY hh:mm'),
      data: {
        schedule: 'test',
        times,
      },
    });

    log
      .save()
      .then(() => {
        console.log('log saved');
      })
      .catch(error => {
        console.log(error);

        // тупо но вдруг
        const log2 = new Log({
          date: moment().format('DD/MM/YYYY hh:mm'),
          data: {
            error,
          },
        });

        log2.save();
      });

    start(callback);
  });
}

export default {
  init,
  start,
};
