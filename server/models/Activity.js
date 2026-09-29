const mongoose = require('mongoose');
const activitySchema = new mongoose.Schema(
  { message: String, by: String },
  { timestamps: true }
);
module.exports = mongoose.model('Activity', activitySchema);
