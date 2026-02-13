import express from "express"

const app = express()

app.use(express.json());

app.get("/user",(req,res)=>{
    res.send("User fetched successfully")
})

export default app;