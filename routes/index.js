import { Router } from "express";
import usersRouter from "./users.js"
const router = Router();
router.use(usersRouter);
export default router;