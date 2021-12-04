import express from "express";
import { MongoClient} from "mongodb";
import dotenv from 'dotenv';
import { studentRouter } from "./routes/students.js";
import { mentorRouter } from "./routes/mentors.js"
import cors from "cors";

const app = express()

app.use(cors()); 

dotenv.config();

const PORT = process.env.PORT;               
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json())

             //allowing any path to access the routes of the application


async function createConnection(){                           //create a mongodb connection
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("mongodb connected");
    return client;
}

export const client = await createConnection();            //export client connection

app.use("/students",studentRouter);                        //students route 
app.use("/mentors",mentorRouter);                          //mentors route
 

app.get("/",(req,res) => {
    res.send("Hello !!!")
})


app.listen(PORT,() => console.log("Server started on Port",PORT));


