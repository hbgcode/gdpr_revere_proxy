require('dotenv').config();
const express= require('express')
const app =express()
const routes = require('./routes')
const Web3 = require('web3');
const mongodb = require('mongodb').MongoClient
const contract = require('truffle-contract');
const artifacts = require('./build/Inbox.json');


// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
var cors = require('cors')


app.use(express.json())
app.use(cors())

// app.post("/upload_files", upload.array("files"), uploadFiles);

if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider)
  } else {
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
}

const LMS = contract(artifacts)
LMS.setProvider(web3.currentProvider)




mongodb.connect(process.env.DB,{ useUnifiedTopology: true }, async(err,client)=>{
    const db =client.db('gdprre')
    // const db =client.db('Cluster0')
    const accounts = await web3.eth.getAccounts();
    const lms = await LMS.deployed();
    console.log("DATA_OWNER")
    //const lms = LMS.at(contract_address) for remote nodes deployed on ropsten or rinkeby
    routes(app,db, lms, accounts)
    app.listen(process.env.PORT || 8082, () => {
        console.log('listening on port '+ (process.env.PORT || 8082));
     })
})
