import Event from "../models/EventModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getEvents = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            response = await Event.findAll({
                attributes: ['uuid', 'title', 'start', 'end', 'allDay'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }else if (req.role === "manager") {
            response = await Event.findAll({
                attributes: ['uuid', 'title', 'start', 'end', 'allDay'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }else {
            response = await Event.findAll({
                attributes: ['uuid', 'title', 'start', 'end', 'allDay'],
                
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getEventById = async (req, res) => {
    try {
        const event = await Event.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!event) return res.status(404).json({ msg: "Données introuvables" });
        let response;
        if (req.role === "admin") {
            response = await Event.findOne({
                attributes: ['uuid', 'title', 'start', 'end', 'allDay'],
                where: {
                    id: event.id
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }else if (req.role === "manager") {
            response = await Event.findAll({
                attributes: ['uuid', 'title', 'start', 'end', 'allDay'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }else {
            response = await Event.findOne({
                attributes: ['uuid', 'title', 'start', 'end', 'allDay'],
                where: {
                    [Op.and]: [{ id: event.id }, { userId: req.userId }]
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createEvent = async (req, res) => {
    const { title, start, end, allDay } = req.body;
    try {
        await Event.create({
            title,
            start,
            end,
            allDay,
            userId: req.userId
        });
        res.status(201).json({ msg: "Événement créé avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!event) return res.status(404).json({ msg: "Données introuvables" });
        const { title, start, end, allDay } = req.body;
        if (req.role === "admin") {
            await Event.update({ title, start, end, allDay }, {
                where: {
                    id: event.id
                }
            });
        }else if (req.role === "manager") {
            response = await Event.findAll({
                attributes: ['uuid', 'title', 'start', 'end', 'allDay'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }else {
            if (req.userId !== event.userId) return res.status(403).json({ msg: "Accès interdit" });
            await Event.update({ title, start, end, allDay }, {
                where: {
                    [Op.and]: [{ id: event.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Événement mis à jour avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!event) return res.status(404).json({ msg: "Données introuvables" });
        if (req.role === "admin") {
            await Event.destroy({
                where: {
                    id: event.id
                }
            });
        }else if (req.role === "manager") {
            response = await Event.findAll({
                attributes: ['uuid', 'title', 'start', 'end', 'allDay'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }else {
            if (req.userId !== event.userId) return res.status(403).json({ msg: "Accès interdit" });
            await Event.destroy({
                where: {
                    [Op.and]: [{ id: event.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Événement supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
