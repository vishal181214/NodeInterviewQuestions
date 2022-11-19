
const express = require('express') 
const app = express(); 
const bcrypt = require('bcrypt')
let bodyParser = require('body-parser');
let joinParser = bodyParser.json();
const cors = require('cors');

const users = [];

const corsOptions = {
    origin:'*',
    Credentials:true,
    optionSucessStatus:200,
}

app.use(cors(corsOptions));

const port = process.env.port||8080;

app.get('/users',(req,res)=>{
    res.json(users);
}) 

app.get('/home',(req,res)=>{
    res.json({
        name:"bill",
        age:19
    })
})

app.post('/signup',joinParser,async(req,res)=>{
    try{
        let foundUser = users.find((data)=>req.body.email === data.email);
        if(!foundUser)
        {
            const salt = await bcrypt.genSalt();
            console.log(salt);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            console.log(hashedPassword);
            const jwtExpire = 1000;
            console.log(req.body);
            const user ={
                name:req.body.name,
                email:req.body.email,
                cell:req.body.cell,
                password:hashedPassword,
                salt:salt
            }
            users.push(user);
            console.log(users);
            console.log(jwtExpire*1000);
            res.status(200).send("User Registered Sucessfully")
        }
        else
        {
            res.send("Email Already in used")
        }
    }
    catch{
            console.log("Internal Server Error");
            res.status(500).send("Internal Server Error");
    }
})

app.post('login',joinParser, async (req,res)=>{
    try{
        const user = users.find((data)=>data.email === req.body.email);
        if(user)
        {
            let subPass = req.body.password;
            let storedPass = user.password;
            if(await bcrypt.compare(subPass,storedPass)){
                res.status(200).send("Login Sucessfull");
            }
            else{
                res.send("Invalid Email or Password")
            }
        }
        else{
            res.send("Invalid Email or Password")
        }
    }
    catch{
        res.status(500).send("Internal Server Error");
    }
})

app.listen(port,()=>{
    console.log("App is running");
})