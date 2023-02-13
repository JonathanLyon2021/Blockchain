const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/blockchain', function (req, res) {

})

app.post('/transaction', function (req, res) {
    console.log(req.body);
    res.send(`Amount of the txn is ${req.body.amount} bitcoin`);
})

app.get('/mine', function (req, res) {

})


app.listen(3000, function(){
    console.log('Listening on port 3000...')
})