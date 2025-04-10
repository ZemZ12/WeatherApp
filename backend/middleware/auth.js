const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    /*
    Ryan Beech: ChatGPT was used in this section to help me set up how to utilize the JWT Authentication token
    in user authentication since I had never used it before and did not know how to get the users objectId out of the JWT token.
    */
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