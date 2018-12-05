
import mongoose from 'mongoose';
import enums from '../lib/enums';

const schema = new mongoose.Schema({
  email: { type: String, required: true, min: 3 },
  username: { type: String, required: true, min: 3 },
  name: { type: String },
  hash: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: { type: String, enum: Object.values(enums.userCategory) },
  resetPasswordToken: { type: String },
  userStatus: { type: String, enum: Object.values(enums.userStatus), default: enums.userStatus.pending },
  walletAddress: { type: String, required: false },
  walletPassword: { type: String, required: false },
  walletPrivateKey: { type: String, required: false},
  bUserId: { type: String, required: false },
});

export default mongoose.models.EpedigreeUser || mongoose.model('EpedigreeUser', schema);
