
import mongoose from 'mongoose';
import enums from '../lib/enums';

const schema = new mongoose.Schema({
  drugName: { type: String },
  description: { type: String },
  diseaseName: { type: String },
  drugImage: { type: String },
  expiryDate: { type: String },
  quantity: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'EpedigreeUser'},
});

export default mongoose.models.Product || mongoose.model('Product', schema);
