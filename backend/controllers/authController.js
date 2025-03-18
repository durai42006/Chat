import User from '../models/user.js'
import { hashPassword,comparePassword } from '../helpers/auth.js';
import jwt from 'jsonwebtoken'

export const test = (req, res) => {
    res.json("test is working");
};


// Regisering process
export const registerUser = async (req, res) => {
    try {
        const {name,email,password} = req.body

        // check name
        if(!name){
             return res.json({
                error:'Name is required'
            })
        }  

        // check password
        if(!password || password.length<6){
            return res.json({
               error:'Password is required and length should be atleast 6 '
           })
       }  

       // check email
       const exist= await User.findOne({email})

       if(exist){
        return res.json({
            error:'Email is already exist'
        })
       }

       const hashedPassword= await hashPassword(password)

    //    create new user in Database
    const newUser = await User.create({
        name,
        email,
        password:hashedPassword,
    })

    return res.json(newUser)


    } catch (error) {
        console.log(error)
    }
};


// Login process
export const loginUser = async (req, res) => {
    try {
        console.log("🔹 Login attempt received");
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ error: "No user found" });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.json({ error: "Password does not match" });
        }

        // Generate JWT Token
        jwt.sign(
            { email: user.email, id: user._id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
            (err, token) => {
                if (err) {
                    console.error("JWT Sign Error:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }

                // Set token in cookie
                res.cookie("token", token, {
                    httpOnly: true, // Secure cookies
                    secure: false, // Set to true in production
                    sameSite: "None", // Allow cross-origin requests
                });
                

                console.log("✅ Login successful, sending response...");
                return res.json({
                    message: "Login successful",
                    user: { id: user._id, name: user.name, email: user.email },
                    token, // Send token as well
                });
            }
        );
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};


export const getProfile = (req, res) => {
    console.log("🟢 Received /profile request");

    const { token } = req.cookies;
    if (!token) {
        console.log("❌ No token found");
        return res.json(null);
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
        if (err) {
            console.error("❌ JWT verification failed:", err);
            return res.status(401).json({ error: "Invalid token" });
        }
        
        console.log("✅ Verified user:", user);
        res.json(user);
    });
};



export const logoutUser = (req, res) => {
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    res.json({ message: "Logout successful" });
};


