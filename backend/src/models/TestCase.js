const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  problemTitle: { type: String, required: true },
  problemLink: { type: String },
  
  // ← Change this from String to Object / Mixed
  constraints: { 
    type: mongoose.Schema.Types.Mixed,   // or type: Object
    required: false 
  },
  
  testCases: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TestCase', testCaseSchema);