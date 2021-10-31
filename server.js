const express =require("express")
const mysql= require("mysql")
const cors=require("cors")
const { response } = require("express")

const app=express()
app.use(express.json())
app.use(cors())
const db=mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"password",
    database:"student_data"
})


app.post("/register",(req,res)=>{

    const studentname=req.body.studentname
    const studentclass=req.body.studentclass
    const phonenumber=req.body.phonenumber
    const pincode=req.body.pincode
    const school=req.body.school

    const Dbvalue=db.query("SELECT id FROM students WHERE studentname=? AND phonenumber=?",
    [studentname,phonenumber],
    (err,result)=>{
        if(err){
            console.log(err)
        }
        if(result.length>0){
            res.send({message:"User Already Exists"})
        }else{
            db.query("INSERT INTO students (studentname,studentclass,school,pincode,phonenumber) VALUES(?,?,?,?,?)",
    [studentname,studentclass,school,pincode,phonenumber],
    (err,result)=>{
        if(err){
            console.log(err)
        }else{
           res.send({message:"Succesfully registered"})
        }}
    )
        }
    })  
}
)

app.post("/login",(req,res)=>{
    const studentname=req.body.loginstudentname
    const phonenumber=req.body.loginstudentphonenumber

    db.query("SELECT score,id FROM students WHERE studentname=? and phonenumber=?",
    [studentname,phonenumber],
    (err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            if(result.length===0){
                res.send({message:"User not found please register"})
            }
            else{
            const {id,score}=result[0]
            if(result[0].score===null){
                db.query("SELECT * FROM students WHERE id=?",
                [id],
                (err,result)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.send(result)
                    }
                })
            }
            else{
                db.query("INSERT INTO students (studentname,phonenumber) VALUES(?,?)",
                [studentname,phonenumber],
                (err,result)=>{
                    const id=result.insertId
                    if(err){
                        console.log(err)
                    }
                    else{
                        db.query("SELECT *FROM students WHERE id=?",
                        [id],
                        (err,result)=>{
                            if(err){
                                console.log(err)
                            }
                            else{
                                res.send(result)
                            }
                        })
                    }
                })
            }
            
        }
        
    }
    })
})

app.put("/updatescore",(req,res)=>{
    const score=req.body.score
    const id=req.body.id
    const rightanswer=req.body.rightAnswer
    const bonus=req.body.bonus
    db.query("UPDATE students SET score=?,rightanswer=?,bonus=?  WHERE id=? ",
    [score,rightanswer,bonus,id],
    (err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(result)
        }
    })
})

app.post("/score",(req,res)=>{
    const name=req.body.name
    const phonenumber=req.body.phonenumber

    db.query("SELECT * FROM students WHERE studentname=? and phonenumber=?",
    [name,phonenumber],
    (err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(result)
        }
    })
})

app.listen(3001,()=>{
    console.log("server running at 3001")
})
