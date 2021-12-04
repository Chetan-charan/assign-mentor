import express from "express";
import { client } from "../index.js";
const router = express.Router(); 



router.route("/").post(async (req,res) => {                                                  //create a new student
    const {name,id,mentor} = req.body;
    const result = await client.db("b28wd").collection("students").insertOne({name,id,mentor});
    if(mentor){
        const result = await client.db("b28wd").collection("mentors").findOneAndUpdate({name : mentor}, {$push: { students: {name,id,mentor}  }});
    }
    res.send(result);
})
.get(async (req,res) => {                                                    //get all students
    const students = await client.db("b28wd").collection("students").find({}).toArray();

    students ? res.send(students) : res.send("Not Found");
})

router.route("/:id").put(async (req,res) => {                            //find a student by Id and add mentor to the student
    const { id } = req.params;
    const data = req.body;
    const {mentor} = req.body;
 
    const student = await client.db("b28wd").collection("students").updateOne({id: id}, {$set: data});
    const studentUpdated = await client.db("b28wd").collection("students").findOne({id: id});
    const result = await client.db("b28wd").collection("mentors").findOneAndUpdate({name: mentor}, {$push: { students:  studentUpdated }});
    res.send(result);
   
})

router.route("/changementor/:id").put(async (req,res) => {          //find a student by Id and change mentor for the student
    const { id } = req.params;
    const {mentor} = req.body;
    const student = await client.db("b28wd").collection("students").findOne({id: id});
    const mentorUpdate1 = await client.db("b28wd").collection("mentors").findOneAndUpdate({name : student.mentor}, {$pull: { students: { id : student.id } }});
    const studentupdate = await client.db("b28wd").collection("students").updateOne({id: id}, {$set: {mentor: mentor}});
   
    
    const mentorUpdate2 = await client.db("b28wd").collection("mentors").findOneAndUpdate({name : mentor}, {$push: { students: student  }});
     
    res.send(mentorUpdate2);
   
})


export const studentRouter = router;                  //export student router