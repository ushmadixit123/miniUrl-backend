// models/Url.js
import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  user_id : {type: mongoose.Schema.Types.ObjectId ,ref: "User",  default : null},
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Url', urlSchema);
