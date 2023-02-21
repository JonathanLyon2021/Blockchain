const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const { v1: uuid } = require('uuid'); //uuid creates a unique random string for us 
const port = process.argv[2]; //port number
const rp = require('request-promise'); //request-promise is a library that allows us to make http requests to other nodes in the network. (npm install request-promise

const bitcoin = new Blockchain(); //instance of our Blockchain constructor function

console.log("uuid:", uuid);
const nodeAddress = uuid().split('-').join(''); //eliminate the dashes in the uuid, then rejoins it with a empty string

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (res,req){
    //table of contents of route endpoints. 
})

app.get('/blockchain', function (req, res) {
    res.send(bitcoin)
})

app.post('/transaction', function (req, res) {
   const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({note: `Transaction will be added in block ${blockIndex}.`});
})

//mine a block
app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash']
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index']+1
    }
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    bitcoin.createNewTransaction(12.5, "00", nodeAddress);

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    res.json({
        note: "New block mined successfully",
        block: newBlock
    })
})

// register a node and broadcast it in the network
app.post('register-and-broadcast-node', function(req, res){
    const newNodeUrl = req.body.newNodeUrl;
    if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

        // '/register-node'
    const regNodesPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node', //options
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },  //data we pass along w/ this request
            json: true  //converts the data to json
        };
        regNodePromises.push(rp(requestOptions)); //pushes the request inton the array
        
    });
    Promise.all(regNodesPromises)
    .then(data => {
        //use the data
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {allNetworkNodes:[...bitcoin.networkNodes, bitcoin.currentNodeUrl]},
            json: true
        };
        return rp(bulkRegisterOptions);
    })
    .then(data => {
        res.json({note: 'New node registered with network successfully.'})
    })
});

//register a node with the network
app.post('/register-node', function(req, res) {

})

//register multiple nodes at once
app.post('/register-nodes-bulk', function(req, res) {

})

app.listen(port, function(){
    console.log(`Listening on port ${port}...`)
})
