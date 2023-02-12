const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

bitcoin.createNewBlock(892348, 'A90SDNFGH56GTHY', 'OIADNFGH56GTHY');

bitcoin.createNewTransaction(100, 'ALEX90SDNFGH56GTHY', 'JENNY90SDNFGH56GTHY');


console.log(bitcoin);