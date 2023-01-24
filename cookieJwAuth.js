const jwt = require("jsonwebtoken");

exports.cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token;
    try {
        console.log("token git")
        const user = jwt.verify(token, process.env.MY_SECRET_KEY);
        req.user = user;
        res.locals.header = '../partials/headerLog'
        next();
    } catch (err) {
        res.locals.header = '../partials/headerNLog'
        console.log("token sie nie zgadza")
        res.clearCookie("token");
        next();
    }
};
