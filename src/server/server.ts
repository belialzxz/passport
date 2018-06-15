import * as express from 'express';
import {Application} from 'express';

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes/routes');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://passportAdmin:paSSP0rt@localhost:27017/passport',{uri_decode_auth: true 
})
    .then(() => console.log("Connection to DB successful"))
    .catch((err) => console.error(err));

const app: Application = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

app.use(bodyParser.json());

let sockets = new Set();




app.use(function (req, res, next) { 
    res.setHeader('Access-Control-Allow-Origin', 'http://54.89.17.143'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); 
    res.setHeader('Access-Control-Allow-Credentials', "true"); 
    res.setHeader('Content-Type', 'application/json');
    next(); 
});






routes(app, io);

io.on('connection', function(socket){
    sockets.add(socket);
    console.log('User socket created.');
});

io.on('disconnect', function(socket){
    socket.close();
    sockets.delete(socket);
    console.log('user disconnected');
})

server.listen(8090, () => {
    console.log('Server is now running on port 8090 ...');
});

