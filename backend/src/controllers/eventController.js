const Event = require("../models/eventModel");
const path = require("path");

// Create a new event
const createEvent = async (req, res) => {
  const { title, description, date, location, maxAttendees } = req.body;

  // Validate input
  if (!title || !description || !date || !location || !maxAttendees) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    // Handle image file upload
    let imageUrl = "";
    if (req.file) {
      // Update the image path to refer to uploads inside src folder
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Create a new event
    const event = await Event.create({
      title,
      description,
      date,
      location,
      maxAttendees,
      imageUrl, // Image file URL
      createdBy: req.user._id, // req.user._id is from the logged-in user
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({
      message: "Server error while creating the event",
      error: error.message,
    });
  }
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "username email")
      .populate("attendees", "username");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching events",
      error: error.message,
    });
  }
};

// Get events by the logged-in user
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id }).populate(
      "attendees",
      "username email"
    );
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching your events",
      error: error.message,
    });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    // Find the event by ID
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the logged-in user is the event creator
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this event" });
    }

    // Delete the event
    await event.deleteOne(); // Using deleteOne() instead of remove()

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error while deleting the event",
      error: error.message,
    });
  }
};

// Update/Edit an event
const updateEvent = async (req, res) => {
  const { title, description, date, location, maxAttendees } = req.body;

  try {
    // Find the event by ID
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the logged-in user is the event creator
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this event" });
    }

    // Update event fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.maxAttendees = maxAttendees || event.maxAttendees;

    // Check if image is uploaded
    if (req.file) {
      event.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await event.save();

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({
      message: "Server error while updating the event",
      error: error.message,
    });
  }
};

// Get a specific event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "username email")
      .populate("attendees", "username");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching the event",
      error: error.message,
    });
  }
};

// RSVP to an event
const rsvpEvent = async (req, res) => {
  try {
    // Find the event by ID
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user has already RSVP'd
    if (event.attendees.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You have already RSVP'd to this event." });
    }

    // Check if the event has reached its maximum attendees
    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: "This event is fully booked." });
    }

    // Add the user to the attendees list
    event.attendees.push(req.user._id);
    await event.save();

    res.status(200).json({ message: "RSVP successful", event });
  } catch (error) {
    res.status(500).json({
      message: "Server error while RSVPing to the event",
      error: error.message,
    });
  }
};

module.exports = {
  deleteEvent,
  updateEvent,
  createEvent,
  getAllEvents,
  getMyEvents,
  getEventById,
  rsvpEvent,
};
