const shortid = require('short-id')
const IPFS = require("ipfs-api")
const IPFS_mini = require('ipfs-mini');
const rsa = require('js-crypto-rsa');
const ipfsClient = require('ipfs-http-client')
// const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})

const projectId = "2DqE0fSVeLCntcc83WDrkCrWBgQ";
const projectSecret = "f75106e2ecf82d6d844f853a417cc3da";
const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const all = require('it-all')
// crypto 
const PRE = require("./functions/encryption");
const Proxy = PRE.Proxy;
const sha3 = require('js-sha3');
// let ec = new elliptic.ec('secp256k1');
const secp = require("noble-secp256k1");
const EthCrypto = require("eth-crypto");
const crypto = require("crypto");
const axios = require('axios');
// const IPFS = require('ipfs-http-client')
const { ethers } = require("ethers");
const ipfs2 = new IPFS({ 
  host: "ipfs.infura.io", 
  port: 5001, 
  protocol: "https",
  headers: {
    authorization: auth,
    }, 
});
const ipfs = new ipfsClient({ 
  host: "ipfs.infura.io", 
  port: 5001, 
  protocol: "https",
  headers: {
    authorization: auth,
    }, 
});
const ipfs_mini = new IPFS_mini({ 
    host: "ipfs.infura.io", 
    port: 5001, 
    protocol: "https",
    headers: {
      authorization: auth,
      }, 
  });
// const ipfs2 = ipfsClient.create({ 
//     host: "ipfs.infura.io", 
//     port: 5001, 
//     protocol: "https",
//     headers: {
//       authorization: auth,
//       }, 
//   });
function routes(app, dbe, lms, accounts){
    let keystore = dbe.collection('sp_key');
    let upload = dbe.collection('data_store');
    let uploadKey = dbe.collection('data_key');
    

    app.post('/upload', async (req,res)=>{
        console.log(req.body);
        const id = req.body.id;
        postData = {
            cData: req.body.cData,
            cKey: req.body.cKey,
            signature:req.body.signature,
            timestamp: new Date()
        }
        console.time('uploadB');
        const file = await ipfs.add(JSON.stringify(postData))
        let hash = file.path
        console.log(file.path);
        console.log(id);
        lms.sendIPFS(id, hash, {from: accounts[0]})
        .then((_hash, _address)=>{
            // upload.insertOne({id, user,timestamp: new Date()})
            res.json({"status":"success", id})
            console.timeEnd('uploadB');
        })
        .catch(err=>{
            console.log("fail");
            res.status(500).json({"status":"Failed", "reason":"Upload error occured"})
            // res.status(400).json({"status":"success"})
        })  
        // console.log("fail");
        // res.status(500).json({"status":"Failed", "reason":"Upload error occured"})
    });



    app.post('/requestVerify', async(req, res) => {
        console.log("request phase Service Provider")
        // console.log(res);
        // console.log(res.data);
        // console.log(res.body);
        // console.log(JSONBigInt.parse(res));
        console.log(req.body);
        // console.log(req);
        token = req.body.token;
        key = req.body.key;
        // console.log(req.body.token);
        // const token = req.body.token;
        console.log(key);
        //         if (token){
        //             // console.log(doc.privateKey);
        await lms.incrementCounter({from: accounts[0]});
                        lms.tokenVerify(token, {from: accounts[0]}).then(response=>{
                            console.log(response);
                            if(response=="ok")
                            {
                                lms.getHash(key, {from: accounts[0]})
                    .then(async(hash)=>{
                        console.log(hash)
                        console.log("hash")
                        // let data = await ipfs.cat(hash)

                        let data = await ipfs2.files.cat(hash)
                        data = JSON.parse(Buffer.from(data).toString('utf8'));
                        console.log(data)
                        cData = data.cData;
                        cKey = data.cKey;
                        console.log(cData);
                        console.log(cKey);
                        // console.log(cData);
                        // console.log(cKey);
                        res.json({"status":"success", data: data})
                    })
                            }
                            else{
                                res.json({"status":"success", data: data.content})
                                
                            }
                        });
        //         } else {
        //             // keystore2.insertOne({ user, publicKey, privateKey })
        //         }     
            })
}
module.exports = routes