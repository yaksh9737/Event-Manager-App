const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createEvent,
  getAllEvents,
  getMyEvents,
  deleteEvent,
  updateEvent,
  getEventById,
  rsvpEvent,
} = require("../controllers/eventController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Create a new event
router.post("/create", protect, upload.single("image"), createEvent);

// Get all events (publicly accessible)
router.get("/all", getAllEvents);

// Get events created by the logged-in user
router.get("/my-events", protect, getMyEvents);

// Delete event (Only the creator can delete their event)
router.delete("/:id", protect, deleteEvent);

// Update event (Only the creator can edit their event)
router.put("/:id", protect, upload.single("image"), updateEvent);

// Public route: Fetch an event by ID (without protect)
router.get("/:id", getEventById); // Fetch an event by ID, no protection

// RSVP to an event
router.post("/:id/rsvp", protect, rsvpEvent);

module.exports = router;
