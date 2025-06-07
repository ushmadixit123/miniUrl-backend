import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/url.js"

dotenv.config();
connectDB().catch(console.dir);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/',routes);

app.listen(process.env.PORT || 5001 , ()=>{
 console.log(`server is listening`)
})
