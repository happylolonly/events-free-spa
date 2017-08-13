const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  date: { type: Number, required: [true] },
  message: { type: String, required: [true] },
});;

const Feedback = mongoose.model('feedback', FeedbackSchema);

module.exports = Feedback;
