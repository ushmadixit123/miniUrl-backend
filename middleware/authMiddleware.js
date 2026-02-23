import jwt from "jsonwebtoken";

 const authMiddleware = (req , res, next) =>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({ message: "No token provided!" });
        }
        
        const token = authHeader.split(" ")[1];
        console.log("token : ", process.env.JWT_SECRET);

        const decode = jwt.verify(token , process.env.JWT_SECRET);


        req.user = decode;
        next();
    }catch(err){
        return res.status(401).json({ message: "Invalid or expired token!", err: err.message });
    }
}
export default authMiddleware;