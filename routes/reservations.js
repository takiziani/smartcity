import { Router } from "express";
import { Hauberge, Resident, Reservation, Site } from "../sequelize/relation.js";
import dotenv from "dotenv";
import verifyjwt from "../utils/jwt.js";
import { Op } from 'sequelize';
dotenv.config();
const router = Router();
router.use(verifyjwt);
router.post('/reservations', async (req, res) => {
    try {
        const { hauberge_id, start_date, end_date, } = req.body;
        const resident_id = req.user.id;
        const reservation = await Reservation.create({ hauberge_id, resident_id, start_date, end_date });
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/hauberge", async (req, res) => {
    try {
        const hauberge = await Hauberge.findAll();
        res.json(hauberge);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/sites", async (req, res) => {
    try {
        const sites = await Site.findAll();
        res.json(sites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
router.get("/hauberge/search", async (req, res) => {
    try {
        const { nom } = req.query;
        const hauberge = await Hauberge.findAll({
            where: {
                nom: {
                    [Op.like]: `%${nom}%`
                },
                disponibilite: true
            }
        });
        res.json(hauberge);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/hauberge/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const hauberge = await Hauberge.findByPk(id);
        res.json(hauberge);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.patch("/reservations/edit", async (req, res) => {
    try {
        const { id, start_date, end_date } = req.body;
        let reservation;
        if (req.user.role == "resident") {
            reservation = await Reservation.findOne({
                where: {
                    id: id,
                    resident_id: req.user.id
                }
            });
        }
        if (req.user.role == "hauberge") {
            reservation = await Reservation.findOne({
                where: {
                    id: id,
                    hauberge_id: req.user.id
                }
            });
        }
        if (req.user.role == "admin") {
            reservation = await Reservation.findByPk(id);
        }
        if (reservation) {
            reservation.start_date = start_date;
            reservation.end_date = end_date;
            await reservation.save();
            res.json(reservation);
        } else {
            res.status(403).json({ error: "Vous n'êtes pas autorisé à accéder à cette ressource" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/reservations", async (req, res) => {
    userid = req.user.id;
    let reservations;
    if (req.user.role == "resident") {
        reservations = Reservation.findAll({
            where: {
                resident_id: userid
            }
        });
    }
    if (req.user.role == "hauberge") {
        reservations = Reservation.findAll({
            where: {
                hauberge_id: userid
            },
            include: [
                {
                    model: Resident,
                    attributes: ['nom', 'prnom']
                }
            ]
        });
    }
    if (reservations) {
        res.json(reservations);
    } else {
        res.status(403).json({ error: "Vous n'êtes pas autorisé à accéder à cette ressource" });
    }
});
export default router;