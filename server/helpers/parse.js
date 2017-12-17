import meetupBy from '../parse/meetupBy';
import eventsDevBy from '../parse/eventsDevBy';
import imaguru from '../parse/imaguru';
import vk from '../parse/vk';
import sportMts from '../parse/sportMts';

import tutby from '../parse/tutby';

import space from '../parse/space';
import htp from '../parse/htp';
import daonlp from '../parse/daonlp';

import citydogVedy from '../parse/citydogVedy';
import citydogAfisha from '../parse/citydogAfisha';


export default (io) => {

  meetupBy.init();
  eventsDevBy.init();
  imaguru.init();
  sportMts.init();

  // tutby.init();

  // htp.init();
  // space.init();
  // daonlp.init();

  citydogAfisha.init();

  setTimeout(() => { // citydog blocks
    citydogVedy.init();
  }, 1000);
  
  vk.init('minskforfree');
  vk.init('free_fitness_minsk');
  vk.init('free_languages_minsk');

  setTimeout(() => {
    io.sockets.emit('events-updated');
  }, 1000*15);

};
