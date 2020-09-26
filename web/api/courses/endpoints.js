const express = require('express'),
    courses = require('../../../repos/course_repo'),
    course = express.Router();

course.get('/', courses.findAll);
course.get('/:id', courses.findById);
course.post('/', courses.createCourse);
course.put('/:id', courses.updateCourse);
course.delete('/:id', courses.deleteCourse);


module.exports = course;