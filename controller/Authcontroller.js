import User from "../models/AuthSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Signup api

export const signup = async (req, res) =>{
    try{
        const {name , email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message : "All fields are required!"});
        }

        let existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message :"User already exist!"});
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const user = await User.create({
            name,
            email,
            password : hashedPassword,
        });

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn : "7d"});

        return res.status(201).json({message : "User created successfully!", token, user : {id: user._id, email : user.email, name : user.name}});

        
    }catch(err){
        return res.status(400).json({message : "Error while creating user!", error : err.message});
    }
}

//login api

export const login = async (req, res)=>{
    try{
        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({message : "All fields are required!"});
        }
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message : "Invalid Credentials!"});
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message : "Invalid Credentials!"});
        }
        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn : "7d"});

        return res.status(200).json({message : "Login Successfull!", token, user : {id: user._id, email : user.email, name : user.name}});


    }catch(err){
        return res.status(400).json({message : "Error while logging user!", error : err.message});
    }

}