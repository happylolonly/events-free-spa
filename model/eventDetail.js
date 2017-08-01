const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  // date: { type: Number, required: [true] },
  // title: { type: String, required: [true] },
  text: { type: String, required: [true] },

  // originalLink: { type: String, required: [true] },
  // source: { type: String, required: [true] },
});;

const Event = mongoose.model('event', EventSchema);

module.exports = Event;
