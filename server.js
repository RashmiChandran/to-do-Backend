const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/todotask', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to Database');
});

const taskListSchema = new mongoose.Schema({
    taskName: String,
    label: String,
    duration: String,
    status: String
});

const taskList = mongoose.model('tasksList', taskListSchema);
app.listen(3000, function () {
    console.log('listening on 3000')
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})
app.get('/', (req, res) => {
    taskList.find((function (err, result) {
        if (err) return console.error(err);
        res.send(JSON.stringify(result));
    }))
});

app.post('/addTask', (req, res) => {
    const insertTaskList = new taskList({
        taskName: req.body.taskName,
        label: req.body.label,
        duration: req.body.duration,
        status: req.body.status
    });
    insertTaskList.save(function (err, success) {
        if (err) return console.error(err);
        res.send(success);
    });
});


app.delete('/deleteTask/', (req, res) => {
    console.log(req)
    taskList.deleteOne({ _id: req.query._id }, function (err,success) {
        if (err)  return handleError(err);
        res.send(success);
      });
});

app.put('/updateTask/', (req, res) => {
    console.log(req)
    taskList.updateOne({ _id: req.body._id }, req.body, function (err,success) {
        if (err)  return handleError(err);
        res.send(success);
      });
});

