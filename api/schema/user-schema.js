const mongoose = require("mongoose");

const workHistorySchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String, required: true, trim: true },
});

const educationHistorySchema = new mongoose.Schema({
  institution: { type: String, required: true, trim: true },
  qualification: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String, required: true, trim: true },
});

const contactSchema = new mongoose.Schema({
  linkedIn: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  overview: { type: String, required: true, trim: true },
  workHistory: { type: [workHistorySchema], required: true },
  educationHistory: { type: [educationHistorySchema], required: true },
  interests: { type: [String], required: true },
  contact: { type: contactSchema, required: true },
});

module.exports = mongoose.model("User", userSchema);
