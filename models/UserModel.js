const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
roleId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Role',
  required: true,
  default: async function () {
    const role = await mongoose.model('Role').findOne({ name: 'User' });
    return role?._id;
  }
},
  siteId: [
    {
      name: { type: String, default: null },
      id: { type: String, default: null },
    }
  ],
  status: {
    type: Number,
    enum: [0, 1], // 0 = Inactive, 1 = Active
    default: 0 // <-- Set default to Inactive
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

