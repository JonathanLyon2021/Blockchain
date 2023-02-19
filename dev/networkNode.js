const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const { v1: uuid } = require('uuid'); //uuid creates a unique random string for us 
const port = process.argv[2]; //port number

const bitcoin = new Blockchain(); //instance of our Blockchain constructor function

console.log("uuid:", uuid);
const nodeAddress = uuid().split('-').join(''); //eliminate the dashes in the uuid, then rejoins it with a empty string

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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
app.post('register-and-broadcast-node', function(req, res)){
    const newNodeUrl = req.body.newNodeUrl;
}


app.listen(port, function(){
    console.log(`Listening on port ${port}...`)
})
