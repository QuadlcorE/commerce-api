import { config } from 'dotenv';
import jwt  from 'jsonwebtoken';

config()

export const auth = (req, res, next) => {
    try {
        // Log request details for debugging
        // console.log("Auth middleware called");
        // console.log("Headers:", req.headers);
        // console.log("Cookies:", req.cookies);
        
        let token = req.cookies?.token || 
                   req.header("Authorization")?.replace("Bearer ", "") || 
                   req.body?.token;

        // console.log("Token found:", token ? "Yes" : "No");
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("Decoded token:", decoded); // Log the decoded token for debugging
            
            if (!decoded || !decoded.username) {
                // console.log("Token missing username property");
                return res.status(401).json({
                    success: false,
                    message: "Invalid token format: missing user data",
                });
            }
            
            req.user = decoded;
            next();
        } catch (err) {
            console.log("Token verification error:", err.message);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
    } catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(500).json({
            success: false,
            message: "Authentication failed",
        });
    }
};