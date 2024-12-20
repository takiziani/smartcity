import { Router } from "express";
import { Hauberge, Resident, Reservation } from "../sequelize/relation.js";
import dotenv from "dotenv";
import verifyjwt from "../utils/jwt.js";
import { Op } from 'sequelize';
dotenv.config();
const router = Router();
router.use(verifyjwt);
router.get("/reservation", async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Vous n'êtes pas autorisé à accéder à cette ressource" });
        }
        if (req.body) {
            const { start_date, end_date } = req.body;
            const reservation = await Reservation.findAll({
                where: {
                    date_entree: {
                        [Op.gte]: start_date
                    },
                    date_sortie: {
                        [Op.lte]: end_date
                    },
                    include: [
                        {
                            model: Resident,
                            attributes: ['nom', 'prnom']
                        }
                    ]
                }
            });
            return res.json(reservation);
        }
        const reservation = await Reservation.findAll({
            include: [
                {
                    model: Resident,
                    attributes: ['nom', 'prnom']
                }
            ]
        });
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/nombre-reservation", async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Vous n'êtes pas autorisé à accéder à cette ressource" });
        }
        if (req.body) {
            const { start_date, end_date } = req.body;
            const reservation = await Reservation.count({
                where: {
                    date_entree: {
                        [Op.gte]: start_date
                    },
                    date_sortie: {
                        [Op.lte]: end_date
                    }
                }
            });
            return res.json(reservation);
        }
        const reservation = await Reservation.count();
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/nombre-resident", async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Vous n'êtes pas autorisé à accéder à cette ressource" });
        }
        if (req.body) {
            const { start_date, end_date } = req.body;
            const resident = await Resident.count({
                where: {
                    date_entree: {
                        [Op.gte]: start_date
                    },
                    date_sortie: {
                        [Op.lte]: end_date
                    }
                }
            });
            return res.json(resident);
        }
        const resident = await Resident.count();
        res.json(resident);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/nombre-hauberge", async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Vous n'êtes pas autorisé à accéder à cette ressource" });
        }
        if (req.body) {
            const { start_date, end_date } = req.body;
            const hauberge = await Hauberge.count({
                where: {
                    date_entree: {
                        [Op.gte]: start_date
                    },
                    date_sortie: {
                        [Op.lte]: end_date
                    }
                }
            });
            return res.json(hauberge);
        }
        const hauberge = await Hauberge.count();
        res.json(hauberge);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/total-montant", async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Vous n'êtes pas autorisé à accéder à cette ressource" });
        }
        if (req.body) {
            const { start_date, end_date } = req.body;
            const montant = await Reservation.sum('montant', {
                where: {
                    date_entree: {
                        [Op.gte]: start_date
                    },
                    date_sortie: {
                        [Op.lte]: end_date
                    }
                }
            });
            return res.json(montant);
        }
        const montant = await Reservation.sum('montant');
        res.json(montant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete("/hauberge/:id", async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Vous n'êtes pas autorisé à accéder à cette ressource" });
        }
        const { id } = req.params;
        const hauberge = await Hauberge.findByPk(id);
        if (!hauberge) {
            return res.status(404).json({ error: "Hauberge non trouvé" });
        }
        await hauberge.destroy();
        res.json({ message: "Hauberge supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete("/resident/:id", async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Vous n'êtes pas autorisé à accéder à cette ressource" });
        }
        const { id } = req.params;
        const resident = await Resident.findByPk(id);
        if (!resident) {
            return res.status(404).json({ error: "Résident non trouvé" });
        }
        await resident.destroy();
        res.json({ message: "Résident supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;