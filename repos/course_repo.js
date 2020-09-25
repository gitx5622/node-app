const Joi = require("@hapi/joi");
const client = require("../db/database");

let findAll = async (req, res, next) => {

    var r = []

    let sql = "SELECT * FROM courses";

    await client.query(sql, r)
        .then(course => res.json(course.rows))
        .catch(next);
};

let findById = async (req, res, next) => {
    let id = parseInt(req.params.id);

    if (!id)
        return res.status(404).send("The course with the given id was not found");

    let sql = "SELECT courses.id, courses.name FROM courses WHERE courses.id= $1";

    await client.query(sql, [id])
        .then(course => res.json(course.rows))
        .catch(next);
};

let createCourse = async (req, res, next) => {

    const {
        error
    } = validateCourse(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    var r = [];

    r.push(req.body.name);

    let sql = `INSERT INTO courses (name) VALUES($1) RETURNING id, name`

    await client.query(sql, r)
        .then(course => res.json(course.rows))
        .catch(next)
}

let updateCourse = async (req, res, next) => {

    const id = parseInt(req.params.id)

    if (!id)
        return res.status(404).send("The course with the given id was not found");

    const { name } = req.body

    client.query(
        'UPDATE courses SET name = $1 WHERE id = $2 RETURNING *',
        [name, id],
        (error, results) => {
            if (error) {
                throw error
            }
            if (typeof results.rows == 'undefined') {
                res.status(404).send(`Resource not found`);
            } else if (Array.isArray(results.rows) && results.rows.length < 1) {
                res.status(404).send(`Course not found`);
            } else {
                res.status(200).send(`Course modified with ID: ${results.rows[0].id}`)
            }

        }
    )
}

let deleteCourse = async (req, res, next) => {
    
    let id = req.params.id;

    if (!id)
        return res.status(404).send("The course with the given id was not found");

    let sql = "DELETE FROM courses WHERE id = ($1) RETURNING id, name";

    await client.query(sql, [id])
        .then(course => res.json(course.rows))
        .catch(next)
}



function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required(),
    };
    return Joi.validate(course, schema);
}


module.exports = {
    createCourse,
    findById,
    findAll,
    updateCourse,
    deleteCourse,
};
