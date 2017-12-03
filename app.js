var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var users = require('./routes/users');

var app = express();
app.listen(3002, function() {
    console.log('api is listining on port 3002');
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api/v1/users', users);

app.get('/api/protected', ensureToken, function(req, res) {
    jwt.verify(req.token, 'my_secret_key', function(err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                description: 'Protected information. Congrats!'
            });
        }
    });
});

app.post('/app/login', function(req, res) {
    const user = { id: 3 }
    const token = jwt.sign({ user }, 'my_secret_key');
    res.json({
        token: token
    });
});

app.get('/foo', ensureToken, function(req, res) {
    sendJSON(res);
});


module.exports = app;

function ensureToken(req, res, next) {
    const bearerheader = req.headers["authorization"];
    if (typeof bearerheader !== 'undefined') {
        const bearer = bearerheader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

//global function
function sendJSON(res) {
    res.json({ name: 'vergelbarit' });
}