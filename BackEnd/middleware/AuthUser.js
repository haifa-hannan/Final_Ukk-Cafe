const jwt = require('jsonwebtoken');
const user = require('../models/index')

module.exports = {
    AuthAdmin(req, res, next) {
        const role = req.user?.role;

        if (!role || role !== "admin") {
            res.status(403).json({ message: "Admin role required" });
            return;
        }

        next();
    },

    AuthUser (req, res, next) {
    const authHeader = req.headers.authorization
    
    if(authHeader){
        let token = authHeader.split('')[1]

        // let verifiedUser = jwt.sign(token, process.env.TOKEN)
        let verifiedUser = jwt.sign({username: user.username, role: user.role, password: user.password},token, process.env.TOKEN)

        if (!verifiedUser) return res.status(401).send('Unauthorized request')

        res.user = verifiedUser
        next()
    }
    else{
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}
}

// module.exports = AuthUser