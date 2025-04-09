const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        return res.status(401).json({ message: "No Token Provided"});
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
        if(err) {
            return res.status(403).json({ message: "Invalid Token"});
        }
        req.user = userData;
        next();
    });
}
module.exports = authenticateToken;