const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  roleId: { type: Number },
  siteId: [
    {
      name: { type: String, default: null },
      id: { type: String, default: null },
    }
  ]
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

