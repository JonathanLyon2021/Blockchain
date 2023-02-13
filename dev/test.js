const Blockchain = require("./blockchain");
const bitcoin = new Blockchain();

// bitcoin.createNewBlock(892348, 'A90SDNFGH56GTHY', 'OIADNFGH56GTHY');
// //createNewBlock() takes in 3 parameters (nonce, previousBlockHash, hash)

// //below is the txn we created
// bitcoin.createNewTransaction(100, 'ALEX90SDNFGH56GTHY', 'JENNY90SDNFGH56GTHY');
// //createNewTransaction takes in 3 parameters (amount, sender, recipient)

// //WE CREATED A TXN ABOVE THEN ADDED A BLOCK. So this block will have the txn we created above
// bitcoin.createNewBlock(902348, 'JONATHANDANIELLYON', 'BRADLEYSCOTTLYON');

// //pending txns until next block is created
// bitcoin.createNewTransaction(30, 'ALEX90SDNFGH56GTHY', 'JENNY90SDNFGH56GTHY');
// bitcoin.createNewTransaction(300, 'ALEX90SDNFGH56GTHY', 'JENNY90SDNFGH56GTHY');
// bitcoin.createNewTransaction(2000, 'ALEX90SDNFGH56GTHY', 'JENNY90SDNFGH56GTHY');

// bitcoin.createNewBlock(902348, 'JONATHANDANIELLYON', 'BRADLEYSCOTTLYON');

// console.log(bitcoin);
//_____________________________________________________________________________________________
const previousBlockHash = 'A90SDNFGH56GTHY';
const currentBlockData = [
    {
        amount: 10,
        sender: 'ALEX90SDNFGH56GTHY',
        recipient: 'JENNY90SDNFGH56GTHY'
    },
   {
        amount: 30,
        sender: 'ADAN0SDNFGH56GTHY',
        recipient: 'JESS90SDNFGH56GTHY',
   },
   {
        amount: 200,
        sender: 'JONATHAN90SDNFGH56GTHY',
        recipient: 'DANIELLE90SDNFGH56GTHY',
   }
];
//const nonce = 100;

//console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));
//bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

console.log(bitcoin.proofOfWork(previousBlockHash,currentBlockData, 79416));

