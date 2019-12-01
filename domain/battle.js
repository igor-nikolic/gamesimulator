const mongoose = require('mongoose');


const battleSchema = mongoose.Schema({
  status: { type: String, enum: ['not_started', 'in_progress', 'aborted', 'finished'], default: 'not_started' },
  armyIds: { type: [String] },
});
module.exports = mongoose.model('Battle', battleSchema);
