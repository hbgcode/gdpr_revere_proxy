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

const Web3 = require('web3');
const setTimeout = require("timers/promises");
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
    let db= dbe.collection('music-users');
    let music = dbe.collection('music-store');
    let keystore = dbe.collection('sp_key');
    let upload = dbe.collection('data_store_sp');
    
    
    app.post('/initialize', (req,res)=>{
        console.log("pass service provider")
        let pkeyDu = req.body.publicKeyDu
        let pkeyDo = req.body.publicKeyDo
        // console.log(pkey)
        // const privateKey = crypto.randomBytes(32).toString("hex");
        // const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
        var kp = Proxy.generate_key_pair();
        const privateKey = Proxy.to_hex(kp.get_private_key().to_bytes());
        const publicKey = Proxy.to_hex(kp.get_public_key().to_bytes());

        console.log("pass data user")
        console.log(publicKey)
        console.log(privateKey)
        user = "service_provider"
        lms.store_du("user", '0x' + pkeyDu.slice(2), {from: accounts[0]})
        lms.store_do("user", '0x' + pkeyDo.slice(2), {from: accounts[0]})
        lms.store_sp("user", '0x' + publicKey.slice(2), {from: accounts[0]})
            keystore.findOne({user}, (err, doc)=>{
                if(doc){
                    console.log("Already registered");
                }else{
                    keystore.insertOne({user , publicKey , privateKey})
                    console.log("inserted");
                    res.json({"status":"success"})
                }
            }) 
    });

    app.post('/upload', async (req,res)=>{
        let buff = req.body.cData;
        let user = req.body.identity;
        let cKey = req.body.cKey;
        let Pdo =  req.body.Pdo;
        let id =  req.body.id;
        let signature =  req.body.signature;
        // const buffer = Buffer.from(buff, "utf-8");
        console.log(req.body)
        if(buff && user){
            postData = {
                id : id,
                cData: buff,
                cKey: cKey,
                signature:signature,
                timestamp: new Date()
            }

            axios.post(`http://localhost:3003/upload`, postData).then((response) => {
                            console.log("sent");
                            res.status(200).json({"status":"uploaded", "reason":"wrong input"})
                        }).catch((error) => {
                            console.warn('file not uploaded to ipfs :');
                            res.status(400).json({"status":"Failed", "reason":"wrong input"})
                        });

            console.log(postData);
            console.log(JSON.stringify(postData))
            
        }else{
            res.status(400).json({"status":"Failed", "reason":"wrong input"})
        }
    })

    app.post('/request', async (req, res) => {
        console.log("request phase Service Provider")
        const sigDu = req.body.sigDu;
        const hashDu = req.body.hashDu;
        const sigDo = req.body.sigDo;
        const hashDo = req.body.hashDo;
        const key = req.body.key;

        if (sigDu && sigDo) {
            keystore.findOne({user:"service_provider"}, async(err, doc) => {
                if (doc) {
                    // console.log(doc.privateKey);
                    docsKey = doc.privateKey;
                    hashSp = EthCrypto.hash.keccak256(sigDo);
                    signatureSp = EthCrypto.sign(docsKey, hashSp);
                    console.log(hashSp);
                    console.log(signatureSp);
                    console.time('request');
                    await lms.incrementCounter({from: accounts[0]});
                    lms.request_data(hashDu,hashDo,hashSp,sigDu,sigDo,signatureSp, {from: accounts[0]})
                    .then(async (token)=>{
                        console.log('request - time');
                        console.timeEnd('request');
                        const postData = {
                            token : token.toNumber(),
                            key : key
                        }
                        axios.post(`http://localhost:3003/requestVerify`,postData)
                        .then((response) => {
                            console.log("sent");
                            console.log(response.data.data);
                            cData = response.data.data.cData;
                            cKey = response.data.data.cKey;
                            signature = response.data.signature;
                            console.log("cKey")
                            console.log(cKey)
                            console.log("cData")
                            console.log(cData)
                            const data = {
                                cKey : cKey,
                                cData : cData
                            }
                            axios.post(`http://localhost:3002/reEncryptKeys`,data)
                        .then((response) => {
                            console.log(response.data.data);
                            rk = response.data.data;
                            console.log("cData");
                            console.log(cData);
                            console.log("rk");
                            console.log(rk);

                            // PRE.reEncryption(rk, cData);
                            // console.log("reencrypted");
                            console.log(cData);
                            // let decryptData = PRE.decryptData("26d8205807655d74845d4c6f8d7353d6bbfc6ea7c826cbb8e01ca7e5b853cdcc", cData);
                            // console.log(decryptData);
                            res.status(200).json({ "status": "Request sent","cKey":rk});
                        });
                            });
                        // res.status(200).json({ "status": "pass", "reason": "wrong input" })
                    });
                } else {
                    // keystore2.insertOne({ user, publicKey, privateKey })
                    res.status(400).json({ "status": "Failed", "reason": "wrong input" })
                }     
            })
        } else {
            res.status(400).json({ "status": "Failed", "reason": "wrong input" })
        }
    });


    app.get('/access2/:id', async (req,res)=>{
        let id = req.params.id
        // if(req.params.id && req.params.email){
            // db.findOne({email:req.body.email},(err,doc)=>{
            //     if(doc){
                console.log("hello")
                    lms.getHash(id, {from: accounts[0]})
                    .then(async(hash)=>{
                        console.log(hash)
                        console.log("hash")
                        // let data = await ipfs.cat(hash)

                        let data = await ipfs2.files.cat(hash)
                        // const data2 = await ipfs_mini.cat(hash);
                        // const content = Buffer.concat(await all(ipfs.cat(hash)))
                        // console.log(content);
                        // let contents = ""
                        // for await(const item of data){
                        //     // turn string buffer to string and append to contents
                        //     contents += new TextDecoder().decode(item)
                        // }
                        // console.log(contents)
                        data = JSON.parse(Buffer.from(data).toString('utf8'));
                        console.log(data)
                        cData = data.cData;
                        cKey = data.cKey;
                        console.log(cData);
                        console.log(cKey);
                        console.log(cData);
                        console.log(cKey);
                        res.json({"status":"success", data: data.content})
                    })
            //     }else{
            //         res.status(400).json({"status":"Failed", "reason":"wrong input"}) 
            //     }
            // })
        // }else{
        //     res.status(400).json({"status":"Failed", "reason":"wrong input"})
        // }
    })
}
module.exports = routes