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
    res.json({note: "Welcome to the Blockchain API, Here are the table of Contents of the endpoints: /blockchain, /transaction, /mine, /register-and-broadcast-node, /register-node, /register-nodes-bulk"});
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
    const regNodePromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node', //options
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },  //data we pass along w/ this request
            json: true  //converts the data to json
        };
        regNodePromises.push(rp(requestOptions)); //pushes the request inton the array
        
    });
    Promise.all(regNodePromises)
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
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1; //if the new node url is not already in the networkNodes array
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl; //if the new node url is not the current node url
    if(nodeNotAlreadyPresent && notCurrentNode){ bitcoin.networkNodes.push(newNodeUrl);} //push the new node url into the networkNodes array
    res.json({note: 'New node registered successfully.'})
})

//register multiple nodes at once
app.post('/register-nodes-bulk', function(req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        bitcoin.networkNodes.push(networkNodeUrl);
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
    });
    res.json({note: 'Bulk registration successful.'})
})

app.listen(port, function(){
    console.log(`Listening on port ${port}...`)
})
