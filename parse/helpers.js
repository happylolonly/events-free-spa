import Event from '../model/event';

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
      const { date, title, originalLink, source } = item;
      Event.findByIdAndUpdate(_id, { date, title, originalLink, source })
        .then(() => {
          console.log('update event');
        })
        .catch(error => {
          console.log('update error', error);
        })
    }

    // ищем по ссылке вида event/2017-08-01/tensorflow-meetup
    console.log(item.originalLink);
    Event.find({ originalLink: item.originalLink })
      .then((data) => {
        // если что то нашлось
        if (data.length > 0) {
          // и другой title или date
          // source тут никак не учавствует вроде
          if (item.title !== data[0].title || item.date !== data[0].date || item.source !== data[0].source ) {
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
