import { Router } from "express";
import { Hauberge, Reservation, Resident } from "../sequelize/relation.js";
import { hashPassword, comparePassword } from "../utils/helper.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import verifyjwt from "../utils/jwt.js";
import { Op } from 'sequelize';
import autoresponse from "../utils/gemini.js";
dotenv.config();
const router = Router();
// Create a new user
router.post("/users/register", async (request, response) => {
    try {
        const user = request.body;
        user.password = hashPassword(user.password);
        if (user.role === "resident") {
            delete user.role;
            const resident = await Resident.create(user);
            response.json({ message: "Resident created" });
        }
        if (user.role === "hauberge") {
            const hauberge = await Hauberge.create(user);
            response.json({ message: "Hauberge created" });
        }
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// delete the user
router.delete("/users/delete", verifyjwt, async (request, response) => {
    const id = request.user.id;
    const role = request.user.role;
    try {
        if (role == "resident") {
            await Resident.destroy({ where: { id_user: id } });
        }
        if (role == "hauberge") {
            await Hauberge.destroy({ where: { id_user: id } });
        }
        response.json({ message: `User with id ${id} has been deleted` });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// login the user
router.post("/users/login", async (request, response) => {
    try {
        const { login, password, role } = request.body;
        if (!login || !password) {
            return response.status(400).json({ error: "Invalid login or password" });
        }
        if (!role) {
            return response.status(400).json({ error: "Invalid role" });
        }
        if (role !== "resident" && role !== "hauberge") {
            return response.status(400).json({ error: "Invalid role" });
        }
        let user;
        if (role == "resident") {
            user = await Resident.findOne({
                where: {
                    [Op.or]: [
                        { email: login },
                        { telephone: login }
                    ]
                }
            });
            if (!user) {
                return response.status(404).json({ error: "User not found" });
            }
            const isPasswordValid = comparePassword(password, user.password);
            if (!isPasswordValid) {
                return response.status(400).json({ error: "Invalid password" });
            }
        }
        if (role == "hauberge") {
            user = await Hauberge.findOne({
                where: {
                    [Op.or]: [
                        { email: login },
                        { telephone: login }
                    ]
                }
            });
            if (!user) {
                return response.status(404).json({ error: "User not found" });
            }
            const isPasswordValid = comparePassword(password, user.password);
            if (!isPasswordValid) {
                return response.status(400).json({ error: "Invalid password" });
            }
        }

        const accessToken = jwt.sign({ "id": user.id, "role": role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ "id": user.id, "role": role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
        user.refreshToken = refreshToken;
        await user.save();
        response.cookie('refreshToken', refreshToken, {
            httpOnly: true, // The cookie is not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (over HTTPS)
            sameSite: 'None', // Strictly same site
            maxAge: 7 * 24 * 60 * 60 * 1000,// Cookie expiry set to match refreshToken,
        });
        // Send the access token to the client
        response.json({
            accessToken
        });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// get the access token based on the refresh token 
router.get("/users/refresh", async (request, response) => {
    try {
        const refreshToken = request.cookies.refreshToken;
        console.log(request.cookies);

        if (!refreshToken) {
            return response.status(401).json({ error: "Refresh token not found" });
        }
        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            console.log(payload);
        } catch (error) {
            return response.status(401).json({ error: "Invalid refresh token" });
        }
        if (payload.role !== "resident" && payload.role !== "hauberge") {
            return response.status(401).json({ error: "Invalid role" });
        }
        if (payload.role == "resident") {
            const user = await Resident.findOne({ where: { id: payload.id } });
            if (!user || user.refresh_token !== refreshToken) {
                return response.status(401).json({ error: "Invalid refresh token" });
            }
        }
        if (payload.role == "hauberge") {
            const user = await Hauberge.findOne({ where: { id: payload.id } });
            if (!user || user.refreshToken !== refreshToken) {
                return response.status(401).json({ error: "Invalid refresh token" });
            }
        }
        const accessToken = jwt.sign({ "id": payload.id, "role": payload.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        response.json({ accessToken });
    } catch (error) {
        response.status(401).json({ error: error.message });
    }
});
// check the user is logged in or not
router.get("/users/check", verifyjwt, async (request, response) => {
    response.json({ message: "User is logged in", userid: request.user.id });
});
// logout the user
router.post("/users/logout", verifyjwt, async (request, response) => {
    try {
        const userrole = request.user.role;
        const cookies = request.cookies;
        let user;
        if (userrole == "resident") {
            user = await Resident.findOne({ where: { refreshToken: cookies.refreshToken } });
            if (!user) {
                return response.status(401).json({ error: "User not found" });
            }
        }
        if (userrole == "hauberge") {
            user = await Hauberge.findOne({ where: { refreshToken: cookies.refreshToken } });
            if (!user) {
                return response.status(401).json({ error: "User not found" });
            }
        }
        user.refreshToken = null;
        await user.save();
        response.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        response.json({ message: "Logged out" });
    } catch (error) {
        response.status(401).json({ error: error.message });
    }
});
// update the user name email and storename
router.patch("/users/update", verifyjwt, async (request, response) => {
    try {
        const id = request.user.id;
        const role = request.user.role;
        const user = request.body;
        let upuser;
        if (role !== "resident" && role !== "hauberge") {
            return response.status(400).json({ error: "Invalid role" });
        }
        let allowedColumns;
        if (role == "resident") {
            allowedColumns = ["nom", "prenom", "telephone", "email", "date_naissance", "lieu_naissance", "sexe", "numero_carte_identite", "permission_parentale"]; // Specify the columns that can be updated
        }
        if (role == "hauberge") {
            allowedColumns = ["nom", "telephone", "email", "capacite", "emplacement", "adresse", "nbr_personne_reserve", "disponibilite"]; // Specify the columns that can be updated
        }

        // Filter out the properties that are not allowed to be updated
        const updatedUser = Object.keys(user).reduce((acc, key) => {
            if (allowedColumns.includes(key)) {
                acc[key] = user[key];
            }
            return acc;
        }, {});
        if (role == "resident") {
            upuser = await Resident.update(updatedUser, { where: { id: id } });
        }
        if (role == "hauberge") {
            upuser = await Hauberge.update(updatedUser, { where: { id: id } });
        }
        response.json({ message: `User with id ${id} has been updated`, updatedUser });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
// update the user password
router.patch("/users/updatepassword", verifyjwt, async (request, response) => {
    try {
        const id = request.user.id;
        const role = request.user.role;
        const { oldpassword, newpassword } = request.body;
        if (!oldpassword || !newpassword) {
            return response.status(400).json({ error: "Invalid password" });
        }
        if (role !== "resident" && role !== "hauberge") {
            return response.status(400).json({ error: "Invalid role" });
        }
        let user;
        if (role == "resident") {
            user = await Resident.findOne({ where: { id: id } });
        }
        if (role == "hauberge") {
            user = await Hauberge.findOne({ where: { id: id } });
        }
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }
        const isPasswordValid = comparePassword(oldpassword, user.password);
        if (!isPasswordValid) {
            return response.status(400).json({ error: "Invalid password" });
        }
        const hash = hashPassword(newpassword);
        try {
            user.password = hash;
            await user.save();
            response.json({ message: "Password updated" });
        } catch (error) {
            response.status(400).json({ error: error.message });
        }
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.get("/resident/plan", verifyjwt, async (request, response) => {
    try {
        if (request.user.role !== 'resident') {
            return response.status(403).json({ error: "Vous n'êtes pas autorisé à accéder à cette ressource" });
        }
        const latest = await Reservation.findOne({ where: { resident_id: request.user.id }, order: [['createdAt', 'DESC']] });
        const duration = Math.ceil((new Date(latest.date_sortie) - new Date(latest.date_entree)) / (1000 * 60 * 60 * 24));
        const plan = await autoresponse(duration);
        response.json({ message: "Plan generated", plan });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});
export default router;