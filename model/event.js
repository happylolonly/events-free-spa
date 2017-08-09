const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  date: { type: Number, required: [true] },
  title: { type: String, required: [true] },
  text: { type: String, required: [true] },

  originalLink: { type: String, required: [true] },
  source: { type: String, required: [true] },
});

const Event = mongoose.model('event', EventSchema);

module.exports = Event;

// EventSchema.virtual('eventsCount').get(function() {
//   return this.posts.length;
// });

// validate: {
//   validator: (name) => name.length > 2,
//   message: 'Name must be longer than 2 characters.'
// },
