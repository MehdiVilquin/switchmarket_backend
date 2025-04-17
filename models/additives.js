const mongoose = require('mongoose');
const { Schema } = mongoose;

const AdditiveSchema = new Schema({
  tag: { type: String, unique: true, required: true },
  shortName: { type: String, required: true },
  name: { type: Schema.Types.Mixed },
  description: String,
  origin: String,
  risk: String
});

module.exports = mongoose.model('Additive', AdditiveSchema,'additives');