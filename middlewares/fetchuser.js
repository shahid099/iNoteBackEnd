const jwt = require('jsonwebtoken');
// Middle to extract the user data from the header.
const fetchuser = (req, res, next)=> {
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).send({error: "Try to get data with right token"});
    }
    try {
        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = data.user;
    } catch (error) {
        res.status(401).send({error: "Internal server error"});
    }

    next();
}

module.exports = fetchuser;

// END