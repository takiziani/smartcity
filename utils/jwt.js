import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// a middleware to verify the jwt token
dotenv.config();
const verifyjwt = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token, process.env.ACCESS_TOKEN_SECRET,
        (error, decoded) => {
            if (error) return res.status(403).json({ error: 'Invalid token' });
            req.user = {}; // Initialize req.user
            req.user.id = decoded.id;
            req.user.role = decoded.role;
            console.log(decoded);
            next();
        });
};
export default verifyjwt;