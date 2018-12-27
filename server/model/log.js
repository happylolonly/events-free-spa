const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  date: { type: String, required: [true] },
  data: { type: Object, required: [true] },
});

const Feedback = mongoose.model('log', FeedbackSchema);

module.exports = Feedback;
