const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const { v1: uuid } = require('uuid'); //uuid creates a unique random string for us 
const port = process.argv[2]; //port number
const rp = require('request-promise'); //request-promise is a library that allows us to make http requests to other nodes in the network. (npm install request-promise
const { post } = require('request');

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

app/post('/transaction/broadcast', function(req, res){
    
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
app.post('/register-and-broadcast-node', function(req, res){
    
    //Step 1
    //registers the new node with itself and then broadcasts it to the entire network
    const newNodeUrl = req.body.newNodeUrl;
    if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
        bitcoin.networkNodes.push(newNodeUrl);
    }
    //if the new node url is not already in the networkNodes array, then push it in

    //Step 2
        //here we are cycling thru all the nodes on the network and making a req to each 1
        //we are registering the new nodes with all the other nodes on the network
    const regNodePromises = []; //this array will hold all the promises/requests
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        //for each network node in the array, we want to make a request to the register-node endpoint
        // '/register-node' //these are the options we pass along with the request
        const requestOptions = {
            uri: networkNodeUrl + '/register-node', //options
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },  //data we pass along w/ this request
            json: true  //converts the data to json
        };
        regNodePromises.push(rp(requestOptions)); //pushes the request into the array
        
    });
    //Step 3
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
    //console.log(nodeNotAlreadyPresent);
    const notCurrentNode = (bitcoin.currentNodeUrl !== newNodeUrl); //if the new node url is not the current node url
    //console.log(notCurrentNode);
    
    if(nodeNotAlreadyPresent && notCurrentNode){
        bitcoin.networkNodes.push(newNodeUrl); //push the new node url into the networkNodes array
    }
    res.json({note: 'New node registered successfully.'})
})

//register multiple nodes at once
app.post('/register-nodes-bulk', function(req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        bitcoin.networkNodes.push(networkNodeUrl);
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        console.log(nodeNotAlreadyPresent);
        console.log(notCurrentNode);
        if (nodeNotAlreadyPresent && !notCurrentNode) {
            bitcoin.networkNodes.push(networkNodeUrl);
        }
    });
    res.json({note: 'Bulk registration successful.'})
})

app.listen(port, function(){
    console.log(`Listening on port ${port}...`)
})
