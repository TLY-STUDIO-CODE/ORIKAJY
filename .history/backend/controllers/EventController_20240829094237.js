import Event from "../models/EventModel.js";

export const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.id }
    });
    if (!event) return res.status(404).json({ msg: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createEvent = async (req, res) => {
  const { title, start, end, allDay } = req.body;
  try {
    const newEvent = await Event.create({
      title,
      start,
      end,
      allDay
    });
    res.status(201).json({ id: newEvent.id, msg: "Event created successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.id }
    });
    if (!event) return res.status(404).json({ msg: "Event not found" });
    const { title, start, end, allDay } = req.body;
    await Event.update({ title, start, end, allDay }, {
      where: { id: event.id }
    });
    res.status(200).json({ msg: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.id }
    });
    if (!event) return res.status(404).json({ msg: "Event not found" });
    await Event.destroy({
      where: { id: event.id }
    });
    res.status(200).json({ msg: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
