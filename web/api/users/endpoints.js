const express = require('express');
const users = require('../../../repos/user_repo');
const login = require('../../../services/user_service')
const authenticateToken = require("../../middlewares/jwt")
const user = express.Router();

user.get('/', authenticateToken, users.findAllUsers);
user.get('/:id', authenticateToken, users.findByUserId);
user.post('/', users.createUser);
user.put('/:id', authenticateToken, users.updateUser);
user.delete('/:id', authenticateToken, users.deleteUser);
user.post('/login', login.loginUser);

module.exports = user;