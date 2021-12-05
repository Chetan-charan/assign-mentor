import express from "express";
import { client } from "../index.js";
const router = express.Router(); 

router.route("/").get(async (req,res) => {                                                     //get all mentors
    const mentors = await client.db("b28wd").collection("mentors").find({}).toArray();
    mentors ? res.send(mentors): res.send("Not found");
})
.post(async (req,res) => {                                                    //create new mentor
    const mentor1 = req.body;
    const result = await client.db("b28wd").collection("mentors").insertOne(mentor1);
    if(!mentor1.students){
        const mentor = await client.db("b28wd").collection("mentors").findOneAndUpdate({name : mentor1.name}, {$set: { students: [] }});
    }
    res.send(result);
})

router.route("/:id").get(async (req,res) => {                         //find mentor by Id and display all students
    const { id } = req.params;
  
    const studentsOfMentor = await client.db("b28wd").collection("mentors").findOne({ id: id },{students: 1});
    res.send(studentsOfMentor)
    
})

router.route("/add-multiple-students/:id").put(async (req,res) => {                          //find mentor by Id and assign mulitple students
    const { id } = req.params;
    const students = req.body;                                                               
    const studentsTobeAdded = students.students;                                            //array of student names
    for(let i=0;i<studentsTobeAdded.length;i++){
        const studentName = studentsTobeAdded[i];
        const studentEntered = await client.db("b28wd").collection("students").findOne({name : studentName});  
        if(!studentEntered.mentor){                                                                                     //check if mentor not assigned to student
        
            const mentor = await client.db("b28wd").collection("mentors").findOne({id : id});
        const result2 = await client.db("b28wd").collection("students").findOneAndUpdate({name : studentName}, {$set: { mentor: mentor.name }});
        const updatedStudent = await client.db("b28wd").collection("students").findOne({name : studentName});
        const result = await client.db("b28wd").collection("mentors").findOneAndUpdate({id : id}, {$push: { students: updatedStudent  }});
        }
        else{
            res.send( {Message :"Mentor already assigned to student" })
            break;
        }
    }
    
})

export const mentorRouter = router;    