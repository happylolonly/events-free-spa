import Event from '../model/event';
import moment from 'moment';


module.exports = (app) => {

  app.get('/events', (req, res) => {

    const { day, search, sources, offset } = req.query;

    if (!sources) {
      res.send = [];
    }


    var start = moment.utc().format();


    // console.log(start.getTimezoneOffset());
    // start.setHours(0,0,0,0);
    start = moment(start).set({hour:0,minute:0,second:0,millisecond:0});

    var end = moment.utc().format();
    end = moment(end).set({hour:23,minute:59,second:59,millisecond:999});
    // end.setHours(23,59,59,999);
    // end.setDate(end.getDate() + 5);

    const obj = {};

    // console.log((start));
    // console.log((start.toUTCString()));

    const dif = 1000*60*60*3;


    switch (day) {
      case 'today':
        obj.date = {$gte: Date.parse(start) - dif , $lt: Date.parse(end) - dif};
        break;

      case 'tomorrow':
        obj.date = {$gte: Date.parse(start) - dif + 1000*60*60*24,  $lt: Date.parse(end) - dif + 1000*60*60*24};
        break;

      case 'all':
        obj.date = {$gte: Date.parse(start) - dif};
        break;

      case 'past':
        obj.date = {$lt: Date.parse(start) - dif  };
        break;
      //
      // default:
      //   obj.date = {$gte: Date.parse(start) - 1000*60*60*3  };
    }


    if (false) {
      // obj.title = /^`${search}`/;
      // obj.title = {$regex : "^" + search, 'i'};
      // obj.title = { $regex: new RegExp("^" + search.toLowerCase()) };
      let reg = new RegExp("^" + search.toLowerCase() + "$");
      // console.log(reg, 'req');
      // obj['title_lower'] = /^soft$/i;

      obj['lower-title'] = { $regex: reg, '$options' : 'i' }

      // db.collection.find({name:{'$regex' : '^string$', })
      // username: {$regex : "^" + req.params.username
    }

    if (sources) {
      // console.log('here', sources);

      const dict = {
        meetupBy: 'meetup.by',
        imaguru: 'imaguru.by',
        eventsDevBy: 'events.dev.by',
        minskforfree: 'vk.com/minskforfree',
        freeFitnessMinsk: 'vk.com/free_fitness_minsk',
        sportMts: 'sport.mts.by',
        citydogVedy: 'citydog.by/vedy',
        citydogAfisha: 'citydog.by/afisha',
      }

      // console.log(sources.split(','));

      obj.source = { $in: sources.split(',').map(item => dict[item]) };
    }

    obj.status = 'active';

    console.log(obj);

    const getTotalCount = () => {
      return new Promise((resolve, reject) => {
        Event.find(obj)
          .count()
          .then(count => {
            console.log(count);
            resolve(count);
          })
          .catch(error => {
            console.log(error);
          })
      });
    }

    const getEvents = () => {
      return new Promise((resolve, reject) => {
        Event.find(obj)
          .sort(day === 'past' ? { date: -1 } : { date: 1 })
          .skip(+offset)
          .limit(10)
          .then(events => {
            // console.log(events)

            //  if (this.state.events.length === 0) return this.state.events;
            // пока костыль
             let items = events.filter(item => {
               let item2 = item.title.toLowerCase();
               return item2.indexOf(search.toLowerCase()) !=-1;
             });

             let filteredItems = items.map(item => {
               const { _id:id, title, source, originalLink, date} = item;
               return {
                 id,
                 date,
                 title,
                 source,
                 originalLink
               }
             })

             resolve(filteredItems);
          })
          .catch(error => {
            console.log(error);
          })
      });
    }

    Promise.all([getTotalCount(), getEvents()])
      .then(data => {
        console.log('data lst', data);

        res.json({
          model: data[1],
          totalCount: data[0]
        });
      })
      .catch(error => {
        console.log('promise error', error);
      })

  })

  app.get('/event', (req, res) => {
    const { id } = req.query;

    Event.find({ _id: id })
      .then(item => res.send(item));
  });
}
