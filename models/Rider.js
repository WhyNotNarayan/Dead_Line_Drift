const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  riderId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  minute: { type: Number, required: true, min: 0, max: 59 },
  second: { type: Number, required: true, min: 0, max: 59 },
  distance: { type: Number },
  finish: { type: Boolean, default: false },

  // Email ko optional bana do aur unique index hata do
  email: { 
    type: String, 
    required: false,          // ← not required
    unique: false,            // ← no unique constraint
    sparse: true,             // ← allow multiple nulls
    trim: true,
    lowercase: true
  }
});

// models/Rider.js  (add this at the end, before module.exports)
riderSchema.virtual('totalSeconds').get(function() {
    return (this.minute * 60) + this.second;
  });
  
  riderSchema.set('toJSON', { virtuals: true });
  riderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Rider', riderSchema);