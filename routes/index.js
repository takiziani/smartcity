import { Router } from "express";
import usersRouter from "./users.js"
import reservationsRouter from "./reservations.js"
import adminRouter from "./admin.js"
const router = Router();
router.use(usersRouter);
router.use(reservationsRouter);
router.use(adminRouter);
export default router;