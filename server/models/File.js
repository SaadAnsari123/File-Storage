const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: {
    type: String, // The name of the file on the server (could be hashed or same as original if handled)
    required: true
  },
  originalName: {
    type: String, // Original name uploaded
    required: true
  },
  displayName: {
    type: String, // Name user wants to see (renamed version)
    required: true
  },
  grNumber: {
    type: String,
    required: true,
    unique: true
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  userSelectedDate: {
    type: Date,
    default: Date.now
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('File', FileSchema);
