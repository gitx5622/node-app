const bcrypt = require("bcrypt")

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
};
const compareHash = async (plainTextPassword, passwordHash) => {
    return await new Promise((resolve, reject) => {
        bcrypt.compare(plainTextPassword, passwordHash, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
module.exports = {
    hashPassword,
    compareHash
};