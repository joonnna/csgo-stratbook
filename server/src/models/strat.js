const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const stratSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  map: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'maps',
    required: true,
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'teams',
    required: true,
  },

  side: {
    type: String,
    enum: ['CT', 'T'],
    required: true,
  },

  type: {
    type: String,
    enum: ['PISTOL', 'FORCE', 'BUYROUND'],
    default: 'BUYROUND',
  },

  active: {
    type: Boolean,
    default: true,
  },

  videoLink: {
    type: String,
  },

  note: {
    type: String,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'players',
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },

  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'players',
  },

  modifiedAt: {
    type: Date,
    default: Date.now,
  },
});

stratSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

stratSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.modifiedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Strat', stratSchema);
