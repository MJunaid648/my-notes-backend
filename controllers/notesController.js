import { Notes } from "../models/notesModel.js";

export const setNotes = async (req, res, next) => {
  const { title, description, date } = req.body;
  try {
    const note = await Notes.create({
      title,
      description,
      date,
      user: req.user._id,
    });
    return res.status(200).send({
      status: 1,
      data: note,
    });
  } catch (error) {
    res.send({ status: 0 });
  }
};

export const getNotes = async (req, res, next) => {
  try {
    const note = await Notes.find({ user: req.user._id });
    return res.status(200).send({
      status: 1,
      data: note,
    });
  } catch (error) {
    res.send({ status: 0 });
  }
};

export const updateNotes = async (req, res, next) => {
  const { title, description, date } = req.body;
  const { id } = req.params;
  console.log(id);
  try {
    const note = await Notes.findByIdAndUpdate(id, {
      title,
      description,
      date,
      user: req.user._id,
    });
    return res.status(200).send({
      status: 1,
      data: note,
    });
  } catch (error) {
    res.send({
      status: 0,
    });
  }
};

export const deleteNotes = async (req, res, next) => {
  const { id } = req.params;
  try {
    const note = await Notes.deleteOne({ _id: id });
    return res.status(200).send({
      status: 1,
    });
  } catch (error) {
    res.send({ status: 0 });
  }
};
