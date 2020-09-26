const bcrypt = require("bcrypt")
const Joi = require("@hapi/joi");
const client = require("../db/database");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const jwtExpirySeconds = 3600
const
    findByUserEmailSQL = `SELECT * FROM users WHERE LOWER(users.email)= LOWER($1)`

let loginUser = async (req, res) => {

    const {
        error
    } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const email = req.body.email;
    const user = await client.query(findByUserEmailSQL, [email])
    if (typeof user.rows == "undefined") {
        res.status(404).send(`Password or email is incorrect`);
    } else if (Array.isArray(user.rows) && user.rows.length < 1) {
        res.status(404).send(`Password or email is incorrect`);
    }
    const bool = await bcrypt.compare(req.body.password, user.rows[0].password);
    if (bool === true) {
        const token = await generateAccessToken(parseInt(`${ user.rows[0].id }`));
        return res.status(200).json(token).send(token);
    } else {
        //handle error wrong pwd
        res.status(401).send("Password or Email is incorrect")
    }
};

function validate(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
}

const generateAccessToken = async (id) => {
    // Create a new token with the username in the payload
    // and which expires 300 seconds after issue
    try {
        const token = await jwt.sign({
            id
        }, process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: jwtExpirySeconds,
        })
        console.log("Token: ", token);
        // return `token: ${token}`
    } catch (err) {
        console.log("Cannot generate token ", err.message)
    }
}

const refresh = (req, res) => {
    // (BEGIN) The code uptil this point is the same as the first part of the `welcome` route
    const token = req.cookies.token

    if (!token) {
        return res.status(401).end()
    }

    var payload
    try {
        payload = jwt.verify(token, jwtKey)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        return res.status(400).end()
    }
    // (END) The code uptil this point is the same as the first part of the `welcome` route

    // We ensure that a new token is not issued until enough time has elapsed
    // In this case, a new token will only be issued if the old token is within
    // 30 seconds of expiry. Otherwise, return a bad request status
    const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
    if (payload.exp - nowUnixSeconds > 30) {
        return res.status(400).end()
    }

    // Now, create a new token for the current user, with a renewed expiration time
    const newToken = jwt.sign({
        username: payload.username
    }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
    })

    // Set the new token as the users `token` cookie
    res.cookie("token", newToken, {
        maxAge: jwtExpirySeconds * 1000
    })
    res.end()
}
module.exports = {
    loginUser
}