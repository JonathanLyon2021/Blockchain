const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

bitcoin.createNewBlock(892348, 'A90SDNFGH56GTHY', 'OIADNFGH56GTHY');
//createNewBlock() takes in 3 parameters (nonce, previousBlockHash, hash)

//below is the txn we created
bitcoin.createNewTransaction(100, 'ALEX90SDNFGH56GTHY', 'JENNY90SDNFGH56GTHY');
//createNewTransaction takes in 3 parameters (amount, sender, recipient)

//WE CREATED A TXN ABOVE THEN ADDED A BLOCK. So this block will have the txn we created above
bitcoin.createNewBlock(902348, 'JONATHANDANIELLYON', 'DANIELLERAEDEIM');


console.log(bitcoin);