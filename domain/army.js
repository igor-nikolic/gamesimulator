const mongoose = require('mongoose');

const armySchema = mongoose.Schema({
  name: { type: String },
  units: { type: Number, minlength: 80, maxlength: 100 },
  strategy: { type: String, enum: ['weakest', 'strongest', 'random'] },
  battleId: String,
});
module.exports = mongoose.model('Army', armySchema);
