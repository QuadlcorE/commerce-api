import { config } from 'dotenv';
import bcrypt from 'bcrypt';
import user from '../models/users.js';
import jwt from 'jsonwebtoken';

config()

// Signup 
export const signup = async(req, res)=> {
    try {
        const {username, email, password}= req.body

        // Check if All Details are there or not
		if (!username ||
			!email ||
			!password
		) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}

        //check if user in database
        const existingUser = await user.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        //secure password
        let hashedPassword
        try {
            hashedPassword = await bcrypt.hash(password,10)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message : `Hashing pasword error for ${password}: `+error.message
            })
        }

        const User = await user.create({
            username, email, password:hashedPassword
        })

        return res.status(200).json({
            success: true,
            User,
            message: "User created successfully"
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message : "User registration failed"
        })
    }
}


export const login = async(req, res)=> {

    try {
        const {email, password} = req.body
        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: "Incomplete login credentials"
            })
        }

        //check for registered User
        let User= await  user.findOne({email})
        if(!User){
            return res.status(401).json({
                success: false,
                message: "Invalid user credentials"
            })
        }

        const payload ={
            email: User.email,
            username: User.username,
            id: User._id,
        }
        // Verify password and generate a JWt token 
        if(await bcrypt.compare(password,User.password)){
             let token = jwt.sign(payload, 
                        process.env.JWT_SECRET,
                        {expiresIn: "2h"}
                        )
            User = User.toObject()
            User.token = token
            
            User.password = undefined
            const options = {
                expires: new Date( Date.now()+ 3*24*60*60*1000),
                httpOnly: true  

            }
            res.cookie(
                "token",
                token,
                options
            ).status(200).json({
                success: true,
                token,
                User,
                message: "Logged in Successfully"

            })

        }else{
            // Wrong Password
            return res.status(403).json({
                success: false,
                message: "Password incorrect"
            })
        }

    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Login failed: " + err
        })
    }

}
