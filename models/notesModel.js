import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notesSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please write Title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please write Desciption"],
  },
  date: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
export const Notes = new mongoose.model("Notes", notesSchema);
