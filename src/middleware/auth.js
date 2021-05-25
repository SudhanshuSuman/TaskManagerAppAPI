const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: tokenData._id, 'tokens.token': token })
        if(!user) {
            console.log("token me kuch garbad h maybe");
            throw new Error()
        }
        req.token = token
        req.user = user
        // console.log("yaha to pahuch raha h", user);
        next()
    } catch(e) {
        res.status(401).send('Authenticate first!')
    }
}

module.exports = auth