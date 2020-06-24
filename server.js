const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/todotask', { useUnifiedTopology: true }).then((client) => {
    const db = client.db('todotask');
    const taskCollection = db.collection('taskList');
    console.log('Connected to Database');
    app.listen(3000, function () {
        console.log('listening on 3000')
    });
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(function(req, res, next){
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    })
    app.get('/', (req, res) => {
        taskCollection.find().toArray().then(result => {
            console.log(result)
            res.send(JSON.stringify(result));
        },(err)=>{
            res.send(err)
        })
        
    });
    app.post('/quotes', (req, res) => {
        res.redirect('/')
        taskCollection.insertOne(req.body).then(result => {
            console.log(result)
        })
    }).catch( error=> {
        console.error(error)
    });;
}) .catch( error=> {
    console.error(error)
});