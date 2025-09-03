const express=require("express");

const cors=require("cors");

const config=require("./config/config");
const userRoute=require("./routes/userRoute")

const app=express();
const port=config.port;

app.use(cors());
app.use(express.json());


app.get('/',(req,res)=>{
  res.send("welcome to home page")
})

app.use("/api/v1/users",userRoute);







app.listen(port,()=>{console.log(`app is listening at port:${port}`)});