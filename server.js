import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/index.js"

dotenv.config();
connectDB().catch(console.dir);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/',routes);

const port = process.env.PORT || 5001 ;
app.listen(port, ()=>{
 console.log(`server is listening on port ${port}`)
})
