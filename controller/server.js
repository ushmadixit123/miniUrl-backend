import express from "express";
import dotenv from "dotenv";
import cors  from "cors";
import connectDB from "../config/db.js";
import urlRoutes from './routes/url.js'
const PORT = process.env.PORT || 3000;

dotenv.config();
connectDB();
const app = express();
app.use(cors());

app.use(express.json());
app.use('/', urlRoutes);

app.listen(PORT , ()=>{
    console.log(`Server is listening on PORT ${PORT}`);
})