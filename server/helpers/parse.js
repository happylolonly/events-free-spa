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

import config from './parse-config';


export default (io) => {
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
    setTimeout(() => { // citydog blocks
      citydogVedy.init();
    }, 1000);
  }
  
  config.minskforfree && vk.init('minskforfree');
  config.freeFitnessMinsk && vk.init('free_fitness_minsk');
  config.freeLanguagesMinsk && vk.init('free_languages_minsk');

  setTimeout(() => {
    io.sockets.emit('events-updated');
  }, 1000*15);

};
