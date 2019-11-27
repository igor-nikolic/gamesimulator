const mongoose = require('mongoose');

const armySchema = mongoose.Schema({
  name: { type: String, required: true },
  units: {
    type: Number, minlength: 80, maxlength: 100, required: true,
  },
  strategy: {
    type: String, enum: ['weakest', 'strongest', 'random'], required: true,
  },
});
module.exports = mongoose.model('Post', armySchema);
