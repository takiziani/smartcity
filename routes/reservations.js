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
        if (req.user.role == 'resident') {
            const { hauberge_id, start_date, end_date, } = req.body;
            const resident_id = req.user.id;
            const reservation = await Reservation.create({ hauberge_id, resident_id, start_date, end_date });
            res.json(reservation);
        }
        if (req.user.role == 'hauberge') {
            const { resident_id, start_date, end_date, } = req.body;
            const hauberge_id = req.user.id;
            const reservation = await Reservation.create({ hauberge_id, resident_id, start_date, end_date });
            res.json(reservation);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/hauberge", async (req, res) => {
    try {
        const hauberge = await Hauberge.findAll({
            where: { disponibilite: true },
            attributes: ["id", "nom", "telephone", "capacite", "adresse", "type"]
        });
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
        const { id } = req.body;
        const update = req.body;
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
            if (update.hauberge_id) reservation.hauberge_id = update.hauberge_id;
            if (update.resident_id) reservation.resident_id = update.resident_id;
            if (update.numero_chambre) reservation.numero_chambre = update.numero_chambre;
            if (update.montant) reservation.montant = update.montant;
            if (update.nature_reservation) reservation.nature_reservation = update.nature_reservation;
            if (update.date_entree) reservation.date_entree = update.date_entree;
            if (update.date_sortie) reservation.date_sortie = update.date_sortie;
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
    try {
        const userid = req.user.id;
        let reservations;
        if (req.user.role == "resident") {
            reservations = await Reservation.findAll({
                where: {
                    resident_id: userid
                }
            });
        }
        if (req.user.role == "hauberge") {
            reservations = await Reservation.findAll({
                where: {
                    hauberge_id: userid
                },
            });
        }
        if (reservations) {
            res.json(reservations);
        } else {
            res.status(403).json({ error: "Vous n'êtes pas autorisé à accéder à cette ressource" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default router;