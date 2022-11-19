const express = require("express");
const bcrypt = require("bcrypt");
const bodyparser = require('body-parser');
const parser = bodyparser.json();

const app = express();


const port = process.env.PORT || 8055;


const users = [];


const isValid = async (mail, password) => {
    for (let i = 0; i < users.length; i++) {
        if(mail == users[i].email) {
            if( await bcrypt.compare(password, users[i].password) == true) {
                return true;
            }
        }
    }

    return false;
}

app.get("/users", (req, res) => {
    res.send(users);
})

app.get("/register", parser,  async (req, res) => {
    let name = req.query.name;
    let email = req.query.email;
    let password = await bcrypt.hash(req.query.password, 10);

    jsonObj = {
        "name": name,
        "email":  email,
        "password": password
    }

    users.push(jsonObj);


    res.status(201).send("registered");
})

app.get("/login", async (req, res) => {
    if(await isValid(req.query.email, req.query.password) == true) {
        res.send("Login Sucess");
    }

    else {
        res.send("wrong credentials");
    }
});


app.post("/sendtoken", parser, (req, res) => {
    let token = req.body.jwt;
    
    for(let i = 0; i < users.length; i++) {
        if(token == users[i].password) {
            res.send(users[i]);
        } else if(i == users.length) {
            res.send("token expired")
        }
    } 

})


app.listen(port, () => {
    console.log("app started");
});