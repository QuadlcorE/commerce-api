import express from 'express';
import {login, signup} from '../controllers/auth.js';
import {auth} from '../../../middleware/authMiddleware.js';
import User from '../models/users.js';

const router = express.Router()


router.post('/login', login)
router.post('/signup', signup)

router.get('/user/:username', auth, async (req, res) => {
    try {
        const { username } = req.params;

        if (!req.user || !req.user.username) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid user data",
            });
        }

        const user = await User.findOne({ username }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.username !== req.user.username) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only access your own data",
            });
        }

        res.json({
            success: true,
            data: {
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (err) {
        console.error("Error in /user/:username:", err); // Log the error
        res.status(500).json({
            success: false,
            message: "Server error: " + err.message, // Include error details
        });
    }
});


//testing protected route
router.get("/testprotected",auth, (req,res)=>{
    res.json({
        success: true,
        message: "You are a validated user"
    })
})

// testing unprotected routes
router.get('/testunprotected', (req,res)=>{
    res.json({
        success: true,
        message: "You are not a valdated user"
    })
})

export default router;