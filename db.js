const mongoose = require('mongoose');
const {Router, json}=require('express');
const jwt = require("jsonwebtoken");
const dbRouter = Router();
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: String,
    pass: String
});
const numberSchema = mongoose.Schema({
    name: String,
    list: String
});

const userModel=mongoose.model('users', userSchema);
const numberModel=mongoose.model('numberList', numberSchema);


dbRouter.get("/", async (req, res) => {
    return res.send("First get");
})

dbRouter.post("/reg", async (req, res) => {
    try {
        userModel.findOne({name: req.body.user}, async function (err, foundedUser) {
            if (foundedUser != null){
                console.log("zajeta nazwa")
                return res.status(400).end()
            }
            else {
                const hashedPassword = await bcrypt.hash(req.body.pass, 10)
                const newUser = new userModel({name: req.body.user, pass: hashedPassword});
                newUser.save((err, savedUser) => {
                    if(err) {
                        console.log("Blad dodawania uzytkownika")
                        return res
                            .status(400)
                            .json({error: "Blad przy zapisywaniu do "});
                    } else {
                        console.log("Dodano do bazy")
                        return res
                            .status(200)
                            .json(savedUser);
                    }
                })
            }
        })
    } catch {
        res.status(500).end()
    }
})

dbRouter.post("/log", async (req, res) => {
        userModel.findOne({name: req.body.user}, async function (err, foundedUser) {
            if (err){
                console.log(err)
            }
            else{
                if (foundedUser == null) {
                    console.log("nie ma, 50/db.js")
                }
                try {
                    if (await bcrypt.compare(req.body.pass, foundedUser.pass)){
                        console.log("zalogowany")
                        const token = jwt.sign({user: foundedUser.name}, process.env.MY_SECRET_KEY, { expiresIn: "1h" });
                        res.locals.name = req.body.user;
                        return res.cookie("token", token).end();
                    }           
                    else{
                        console.log("zle haslo")
                        return res.status(400).end();
                    }
                } catch (err) {
                    console.log(err);
                    res.status(500).end()
                }
            }
        })
})

dbRouter.post("/param", async (req, res) => {
    try{
        const token = req.cookies.token;
        const user = jwt.verify(token, process.env.MY_SECRET_KEY);
        userModel.findOne({name: user.user.name}, async function (err, foundedUser) {
            if (err){
                console.log(err)
            }
            else if (foundedUser == null) {
                    return res.status(400).end();
            }
            // console.log(user.user.name);
            numberModel.findOneAndUpdate({name: user.user}, {list: req.body.numberList},{
                new: true,
                upsert: true
            }, async function(err, doc, res){
                if(err){
                    console.log(err);
                }
            });
        })
        return res.status(200).end();
    } catch{
        console.log("nie zalogowany a chce dac liczby")
        return res.status(400).end();
        // return req.end();
    }
})

dbRouter.get("/param", async (req, res) => {
    try{
        const token = req.cookies.token;
        const user = jwt.verify(token, process.env.MY_SECRET_KEY);
        numberModel.findOne({name: user.user.name}, async function (err, foundedUser) {
            if (err){
                console.log(err)
            }
            else if (foundedUser == null) {
                    console.log("nie podales zadnych liczb")
                    return res.status(400).end();
            }
            else {
                console.log("dane z bazy to:" + foundedUser.list)
                return res
                .status(200)
                .json({result: foundedUser.list});
            }
        })
    } catch{
        // return res.json({result: localStorage.getItem('list')})
        console.log("Nie zalogowany a chce liczby")
        return res.status(400).end();
    }
})

module.exports = dbRouter;
