import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const comments = new Schema({
   id_class: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Classes'
   },
   comment: {
      type: String,
      required: true
   },
   date_created: {
      type: Number,
      required: true
   }
});

export default mongoose.model('Comments', comments);