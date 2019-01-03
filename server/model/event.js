const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  date: { type: Number, required: [true] },
  title: { type: String, required: [true], text: true },
  text: { type: String, required: [true] },
  images: { type: Array },
  contacts: { type: Object },
  location: { type: String },
  tags: { type: Array },

  originalLink: { type: String, required: [true] },
  source: { type: String, required: [true] },

  status: { type: String, required: [true], enum: ['active', 'noactive', 'rejected'] },
});

const Event = mongoose.model('event', EventSchema);

EventSchema.index({ text: 'text' });

module.exports = Event;

// EventSchema.virtual('eventsCount').get(function() {
//   return this.posts.length;
// });

// validate: {
//   validator: (name) => name.length > 2,
//   message: 'Name must be longer than 2 characters.'
// },
