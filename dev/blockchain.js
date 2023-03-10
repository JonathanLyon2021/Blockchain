//this is a network node of the entire blockchain.
const sha256 = require('sha256');
const currentNodeUrl = process.argv[3]; //the url of the current node
const { v1: uuid } = require('uuid'); //uuid creates a unique random string for us 


//constructor function
class Blockchain {
    constructor() { //constructor function
        this.chain = [];
        this.pendingTransactions = [];

        this.currentNodeUrl = currentNodeUrl;
        this.networkNodes = [];

        this.createNewBlock(100, '0', '0'); //genesis block
    }
    createNewBlock(nonce, previousBlockHash, hash) {
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            nonce: nonce,
            hash: hash,
            previousBlockHash: previousBlockHash,
        };

        this.pendingTransactions = [];
        this.chain.push(newBlock);

        return newBlock;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1]; 
    }

    //creates a new txn and pushes it to the node
    createNewTransaction(amount, sender, recipient ){
        const newTransaction = {
            amount: amount,
            sender: sender,
            recipient: recipient,
            transactionId: uuid().split('-').join('')
        };
        console.log("newTransaction:", newTransaction);
        return newTransaction;
    }
}

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj){
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1; // returns index of the block that the transaction will be added to
}
        //this.pendingTransactions.push(newTransaction); //push the newTransaction object to the pendingTransactions array
        //return this.getLastBlock()['index'] + 1; //this.getLastBlock returns the object of the last block


Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + (nonce.toString()) + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData){
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while(hash.substring(0,4) !== '0000'){
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        console.log(hash);
    }
    return nonce;
    
}


module.exports = Blockchain;  //export the Blockchain constructor function