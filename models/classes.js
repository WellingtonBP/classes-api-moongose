import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const classes = new Schema({
   name: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   video: {
      type: String,
      required: true
   },
   date_init: {
      type: Number,
      required: true
   },
   date_end: {
      type: Number,
      required: true
   },
   date_created: {
      type: Number,
      required: true
   },
   date_updated: {
      type: Number
   },
   total_comments: {
      type: Number,
      default: 0
   }
});

export default mongoose.model('Classes', classes);