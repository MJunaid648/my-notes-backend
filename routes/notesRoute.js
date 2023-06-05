import express from "express";
import { deleteNotes, getNotes, setNotes, updateNotes } from "../controllers/notesController.js";
import { protect } from "../controllers/authenticationController.js";
export const router = express.Router();

router.route("/").post(protect, setNotes).get(protect, getNotes)
router.route("/:id").patch(protect, updateNotes).delete(protect, deleteNotes);
