const mongoose = require("mongoose");

const workHistorySchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String, default: null, required: false, trim: true },
});

const qualificationSchema = new mongoose.Schema({
  level: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  grade: { type: String, required: true, trim: true },
});

const educationHistorySchema = new mongoose.Schema({
  institution: { type: String, required: true, trim: true },
  qualifications: { type: [qualificationSchema], required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String, default: null, required: false, trim: true },
});

const contactSchema = new mongoose.Schema({
  linkedIn: { type: String, required: false, trim: true },
  email: { type: String, required: false, trim: true },
  phone: { type: String, required: false, trim: true },
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  overview: { type: String, required: true, trim: true },
  workHistory: { type: [workHistorySchema], default: null, required: false },
  educationHistory: {
    type: [educationHistorySchema],
    default: null,
    required: false,
  },
  interests: { type: [String], default: null, required: false },
  contact: { type: contactSchema, default: null, required: false },
});

module.exports = mongoose.model("User", userSchema);
