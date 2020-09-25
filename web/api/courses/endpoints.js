let express = require('express'),
courses = require('../../../repos/course_repo'),
app = express.Router();

app.get('/',  courses.findAll);
app.get('/:id', courses.findById);
app.post('/', courses.createCourse);
app.put('/:id', courses.updateCourse);
app.delete('/:id', courses.deleteCourse);


module.exports = app;