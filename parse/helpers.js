import Event from '../model/event';

import moment from 'moment';

// model Event
// date: 1502218800000
// title: "SOFT SKILLS GYM"
// originalLink: "event/soft-skills-gym-3/"
// source: "imaguru.by"
// _id: "598740d6ac53c8355c846c0c"

export const saveEventItemToDB = (results) => {
  results.forEach(item => {

    const saveEvent = () => {
      const event = new Event(item);
      event.save()
        .then(() => {
          console.log('saved new');
        })
        .catch(error => {
          console.log(error);
        })
    }

    const updateEvent = (_id, item) => {
      const { date, title, originalLink, source, text, images} = item;
      Event.findByIdAndUpdate(_id, { date, title, originalLink, source, text, images })
        .then(() => {
          console.log('update event');
        })
        .catch(error => {
          console.log('update error', error);
        })
    }

    // ищем по ссылке вида event/2017-08-01/tensorflow-meetup
    // console.log(item.originalLink);
    Event.find({ originalLink: item.originalLink })
      .then((data) => {
        // если что то нашлось
        if (data.length > 0) {
          // и другой title или date
          // source тут никак не учавствует вроде
          if (item.title !== data[0].title || item.date !== data[0].date || item.source !== data[0].source || item.text !== data[0].text || item.images !== data[0].images) {
            updateEvent(data[0]._id, item);
            return;
          }
          console.log('event actual', item.title, 'from', item.source);
        // если не нашлось в бд
        } else {
          saveEvent();
        }
      })
      .catch(error => {
        console.log(error);
      })
  })
}


export const convertMonths = (text) => {

  const monthRU = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июн', 'Июл', 'Август', 'Сентябр', 'Октябр', 'Ноябр', 'Декабр'];
  const monthEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


  monthRU.forEach((item, i) => {
    let startIndex = text.toLowerCase().indexOf(item.toLowerCase());

    while (startIndex >= 0) {
      let endIndex = text.indexOf(' ', startIndex);
      if (endIndex === -1) {
        endIndex = text.length;
      }
      const russianMonth = text.slice(startIndex, endIndex);

      text = text.replace(russianMonth, monthEN[i]);
      startIndex = text.toLowerCase().indexOf(item.toLowerCase());
    }
  });

  return text;
}


export const formatDate = (year, month, day, hour, minute) => {
  const date = Date.parse(moment(new Date(year, month - 1, day, hour || 0, minute || 0 )));

  // console.log(moment(new Date(year, month - 1, day, hour || 0, minute || 0 )));

  // console.log(moment(new Date(year, month - 1, day, hour || '')));
  // console.log('hwew', date);
  // const date = Date.parse(moment.tz(new Date(year, month - 1, day, hour || '', minute || ''), 'Europe/Minsk'));
  // const date = Date.UTC(year, month - 1, day, hour || 0, minute || 0);

  // console.log((moment.utc(date).format()));
  return Date.parse(moment.utc(date).format());
  // console.log( new Date().getTimezoneOffset());

  // const date = Date.parse(moment(new Date(year, month - 1, day, hour || '')).locale('ru'));
//
//   var timestamp = new Date();
// var inverseOffset = moment(date).utcOffset() * -1;
// timestamp = moment().utcOffset( inverseOffset  );
//
// return timestamp.toISOString(); // This should give you the accurate UTC equivalent.
// console.log(timestamp.toISOString());


// лол

// const date = new Date(year, month - 1, day, hour || '', minute || '');

// console.log(date);
// console.log(new Date());
// console.log(moment(date));
// console.log('kkl',new Date(year, month - 1, day, hour || 0, minute || 0));
// console.log(year, month - 1, day, hour || 0, minute || 0);
// console.log(new Date(year, month - 1, day, hour || '', minute || ''));
// console.log(moment(date));
// Europe/Minsk
// console.log(moment(1369266934311).tz('America/Phoenix').format('YYYY-MM-DD HH:mm'));
// console.log(moment.tz("2013-11-18 11:55", "America/Toronto"));
// console.log(moment(new Date(year, month - 1, day, hour || '', minute || '')).locale('ru'));
// console.log(new Date(year, month - 1, day, hour || '', minute || ''));
// console.log(date);
// console.log(moment.tz(new Date(year, month - 1, day, hour || '', minute || ''), 'Europe/Minsk'));
// console.log(moment(new Date(year, month - 1, day, hour || '', minute || '')));
// console.log('withot timezone', Date.parse(moment(new Date(year, month - 1, day, hour || '', minute || ''))) === date);
// console.log('without', moment(new Date(year, month - 1, day, hour || '', minute || '')));
// console.log(date);

// const month = moment().month('август').format("MM");
// const date = Date.parse(`2017-${month}-${before}T00:00`);
}
