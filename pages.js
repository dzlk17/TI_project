const {Router, json}=require('express');
const pagesRouter = Router();
const{cookieJwtAuth} = require('./cookieJwAuth');

pagesRouter.use(cookieJwtAuth);

pagesRouter.get("/", async (req, res) => {
    res.render('pages/index');
    return res.send("First get");
})

pagesRouter.get("/animation", async (req, res) => {
    res.render('pages/animation');
})
pagesRouter.get("/description", async (req, res) => {
    res.render('pages/animDescription');
})

pagesRouter.get("/log", async (req, res) => {
    res.render('pages/log');
}) 
pagesRouter.get("/logOut", async (req, res) => {
    res.clearCookie("token");
    res.redirect('/log');
}) 
pagesRouter.get("/reg", async (req, res) => {
    res.render('pages/reg');
})
module.exports = pagesRouter;