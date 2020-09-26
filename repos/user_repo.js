const Joi = require("@hapi/joi");
const client = require("../db/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const jwtExpirySeconds = 3600;

const findByUserIdSQL = `SELECT users.id, users.name, users.email, users.password FROM users WHERE users.id= $1`,
  findAllUsersSQL = `SELECT * FROM users`,
  createUserSQL = `INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *`,
  updateUserSQL = `UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $3 RETURNING *`,
  deleteUserSQL = `DELETE FROM users WHERE id = ($1) RETURNING *`;

let findAllUsers = async (req, res) => {
  await client.query(findAllUsersSQL).then((users) => res.json(users.rows));
};

let findByUserId = async (req, res) => {
  let id = parseInt(req.params.id);

  if (!id)
    return res.status(404).send("The course with the given id was not found");

  await client.query(findByUserIdSQL, [id]).then((user) => res.json(user.rows));
};

let createUser = async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  const name = req.body.name;
  const email = req.body.email;
  const salt = await bcrypt.genSalt(10);
  const hashedPw = await bcrypt.hash(req.body.password, salt);
  const values = [name, email, hashedPw];
  await client.query(createUserSQL, values, (err, response) => {
    console.log(response.rows);
    generateAccessToken(parseInt(`${response.rows[0].id}`));
    res.status(200).json(response.rows);
  });
};

let updateUser = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id)
    return res.status(404).send("The course with the given id was not found");

  const { error } = validateUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password } = req.body;

  await client.query(
    updateUserSQL,
    [name, email, password, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      if (typeof results.rows == "undefined") {
        res.status(404).send(`Resource not found`);
      } else if (Array.isArray(results.rows) && results.rows.length < 1) {
        res.status(404).send(`Course not found`);
      } else {
        res.status(200).send(`Course modified with ID: ${results.rows[0].id}`);
      }
    }
  );
};

let deleteUser = async (req, res) => {
  let id = req.params.id;

  if (!id)
    return res.status(404).send("The course with the given id was not found");

  await client.query(deleteUserSQL, [id]).then((user) => res.json(user.rows));
};

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(user, schema);
}

const generateAccessToken = async (id) => {
  // Create a new token with the username in the payload
  // and which expires 300 seconds after issue
  try {
    const token = await jwt.sign({ id }, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds,
    });
    console.log("Token: ", token);
    // return `token: ${token}`
  } catch (err) {
    console.log("Cannot generate token ", err.message);
  }
};

module.exports = {
  createUser,
  findByUserId,
  findAllUsers,
  updateUser,
  deleteUser,
};
