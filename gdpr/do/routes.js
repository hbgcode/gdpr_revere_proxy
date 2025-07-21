const rsa = require('js-crypto-rsa');
const shortid = require('short-id')
const IPFS = require("ipfs-api")
// const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})

const projectId = "2DqE0fSVeLCntcc83WDrkCrWBgQ";
const projectSecret = "f75106e2ecf82d6d844f853a417cc3da";


const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const axios = require('axios');

// crypto 
const PRE = require("./functions/encryption");
const Proxy = PRE.Proxy;

const sha3 = require('js-sha3');
// let ec = new elliptic.ec('secp256k1');
const secp = require("noble-secp256k1");
const EthCrypto = require("eth-crypto");
const crypto = require("crypto");
// const mongoose = require("mongoose");

// const IPFS = require('ipfs-http-client')
const ipfs = new IPFS({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
        authorization: auth,
    },
});


function routes(app, dbe, lms, accounts) {
    let keystore = dbe.collection('du_key')
    let keystore2 = dbe.collection('do_key')
    let db = dbe.collection('music-users')
    let upload = dbe.collection('do_data_store')
    let data_key = dbe.collection('data_key_store_do')
    // var mySchema = mongoose.Schema({
    //     id: String,
    //     hash: String,
    //     user: String
    //        })
        // var myModel = DB.model('data_store', mySchema)
    app.post('/storeKey', (req, res) => {
        let pkey = req.body.publicKey
        let skey = req.body.privateKey
        let user = req.body.user
        let idd = shortid.generate()
        // console.log(req.body)
        // console.log(req.files)
        // console.log("hello")
        if (pkey) {
            keystore.findOne({ user }, (err, doc) => {
                if (doc) {
                    res.status(400).json({ "status": "Failed", "reason": "Already registered" })
                } else {
                    keystore.insertOne({ idd, user, pkey, skey })
                    res.json({ "status": "success", "id": idd })
                }
            })
        } else {
            res.status(400).json({ "status": "Failed", "reason": "wrong input" })
        }
    })

    app.post('/initialize', (req, res) => {
        console.log("pass data owner")
        let pkey = req.body.publicKey
        console.log(pkey)

        // now you get the JWK public and private keys
        // const privateKey = crypto.randomBytes(32).toString("hex");
        // const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
        var kp = Proxy.generate_key_pair();
        const privateKey = Proxy.to_hex(kp.get_private_key().to_bytes());
        const publicKey = Proxy.to_hex(kp.get_public_key().to_bytes());
        console.log("pass data user")
        console.log(publicKey)
        console.log(privateKey)
        user = "data_owner"
        if (pkey) {
            keystore2.findOne({ user }, (err, doc) => {
                if (doc) {
                    console.log("Already registered");
                } else {
                    keystore2.insertOne({ user, publicKey, privateKey })
                }
                res.json({ "status": "success" })
                const userData = {
                    identity: "user",
                    publicKeyDu: pkey,
                    publicKeyDo: publicKey
                };
                axios.post(`http://localhost:3001/initialize`, userData)
                    .then((response) => {
                        console.log("sent");
                    });
            })
        } else {
            res.status(400).json({ "status": "Failed", "reason": "wrong input" })
        }

    });

    app.post('/upload', async (req, res) => {
        let buff = req.body.buff
        let user = req.body.user
        let id = shortid.generate() + shortid.generate(1)
        if (buff && user) {
            // const privateKey = crypto.randomBytes(32).toString("hex");
            // const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
            var kp = Proxy.generate_key_pair();
            const privateKey = Proxy.to_hex(kp.get_private_key().to_bytes());
            const publicKey = Proxy.to_hex(kp.get_public_key().to_bytes());

            // signature generation 
            const address = EthCrypto.publicKey.toAddress(publicKey.slice(2));
            const hash = sha3.keccak256 (Math.floor((Math.random() * 100) + 1).toString());
            // const signature = EthCrypto.sign(privateKey, hash);
            console.log(hash);
            const signature = await secp.sign(hash, privateKey);
            console.log("signature");
            console.log(signature);
            console.log(buff);
            encrypted = PRE.encryptData(publicKey, buff);

            keystore2.findOne({ user:"data_owner" }, (err, doc) => {
                if (doc) {
                    console.log(doc);
                    Pdo = doc.publicKey;
                    console.log(Pdo);
                    Ckey =  PRE.encryptData(Pdo, privateKey);
                    console.log("Ckey");
                    console.log(Ckey);
                    upload.findOne({ user }, (err, doc) => {
                    upload.insertOne({id, user:"user", publicKey , privateKey , hash, timestamp: new Date() })  
                        // now you get an encrypted message in Uint8Array
                        const postData = {
                            id: id,
                            identity: "user",
                            cData: encrypted,
                            cKey: Ckey,
                            Pdo: Pdo,
                            signature:signature,
                            timestamp: new Date()
                        };

                        console.log("encrypted");
                        console.log(postData);
                        axios.post(`http://localhost:3001/upload`, postData).then((response) => {
                            console.log("sent");
                            res.json({ "status": "success", "id": doc.id })
                        }).catch((error) => {
                            console.warn('file not uploaded to ipfs :');
                        });
                        // res.json({ "status": "success" })
                    })
                } else {
                    res.status(400).json({ "status": "Failed", "reason": "Not recognised" })
                }
            })
        }
        else {
            res.status(400).json({ "status": "Failed", "reason": "wrong input" })
        }
    })

    app.get('/getSign', async (req, res) => {
        console.log("got here");
        await keystore.find({ user:"user"}).toArray(function (err, docs){
            console.log("got here2");
            if (docs) {
               
               docsKey = docs[0].skey;

               hash = EthCrypto.hash.keccak256(Math.floor((Math.random() * 100) + 1));
               signature = EthCrypto.sign(docsKey, hash);
               res.status(200).json({ "status": "Created","signature":signature , "hash": hash})
            }
            else{
                res.status(401).json({ "status": "Not found"})
            }
        })
   
    })


    app.post('/reEncryptKeys', (req, res) => {
        console.log("Re encryption begin");
        console.log("req.body.sigDu");
        console.log(req.body);
        eKey = req.body.cKey;
        eData = req.body.cData;
        keystore2.findOne({ user:"data_owner" }, (err, doc) => {
            if (doc) {
                console.log(doc);
                Sdo = doc.privateKey;
                let cKey = PRE.decryptData(Sdo, eKey);
                let decryptData = PRE.decryptData(cKey, eData);
                console.log(cKey);
            keystore.findOne({ user:"user" }, (err, doc) => {
                if(doc){
                 pDu = doc.pkey;
                 console.log(pDu);
                let rk = PRE.generateReEncrytionKey(cKey, pDu);
                // console.log("rk")
                // console.log(rk)
                res.status(200).json({ "status": "passed", "data": decryptData })
            }
            });

            }
            else{
                res.status(400).json({ "status": "Failed", "reason": "No key found" })
            }

        });
    });

app.post('/request', (req, res) => {
        console.log("request phase data owner")
        const sig = req.body.signature;
        const hash = req.body.hash;
        let key = req.body.key;
        upload.findOne({id:key}, (err, doc) => {
            if(doc){
                key2 = doc.hash;
                if (sig && hash) {
                    keystore2.findOne({user:"data_owner"}, (err, doc) => {
                        if (doc) {  
                       docsKey = doc.privateKey;
                            // console.log(doc.privateKey);
                            hashDo = EthCrypto.hash.keccak256(sig);
                            signatureDO = EthCrypto.sign(docsKey, hashDo);
                            console.log(hashDo);
                            console.log(signatureDO);
                        const postData =    {
                            sigDu: sig,
                            hashDu: hash,
                            sigDo: signatureDO,
                            hashDo: hashDo,
                            key: key
                        };
                        axios.post(`http://localhost:3001/request`, postData)
                            .then((response) => {
                                cData = response.data.cKey;
                                keystore.findOne({ user:"user" }, (err, doc) => {
                                    if (doc) {
                                        pkDu = doc.skey;
                                        // let decryptData = PRE.decryptData(pkDu, cData);
                                        // console.log(decryptData);
                                        res.status(200).json({ "status": "Request sent","data":cData})
                                    }
                                });
                          
                            });
                        } else {
                            // keystore2.insertOne({ user, publicKey, privateKey })
                        }
                      
                    })
                } else {
                    res.status(400).json({ "status": "Failed", "reason": "wrong input" })
                }
            }
            else{
                res.status(400).json({ "status": "Failed", "reason": "No data id found" })
            }
        });
        

    });


    
    
    app.get('/getKeys', (req, res) => {
        var kp = Proxy.generate_key_pair();
        const privateKey = Proxy.to_hex(kp.get_private_key().to_bytes());
        const publicKey = Proxy.to_hex(kp.get_public_key().to_bytes());
        // const privateKey = crypto.randomBytes(32).toString("hex");
        // const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
        // console.log(key);
        console.log(privateKey);
        console.log(publicKey);

        const dataUser = {
            publicKey: publicKey,
            privateKey: privateKey
        };
        res.status(200).json({ "status": "Created", data: dataUser })
    })

    app.get('/documentlist/:user', async(req, res) => {
        console.log(req.params.user)
        if (req.params.user) {
            console.log(req.params.user)
             await upload.find({ user:"user"}).toArray(function (err, docs){
                 if (docs) {
                    docs.map(doc => doc.user).sort();
                    console.log(docs);
                    console.log("docs");
                    res.json({ "status": "success" , docs})
                }
            })
            // console.log(data)
        } else {
            res.status(400).json({ "status": "Failed", "reason": "wrong input" })
        }
    })

    app.get('/access/:title/:id', async (req, res) => {
        let id = req.params.id
        console.log(req.params)
        if (req.params.id && req.params.title) {
            console.log("123")
            // music.findOne({title:req.params.title},(err,doc)=>{
            music.findOne({ title: "groot" }, (err, doc) => {
                if (doc) {
                    lms.getHash(id, { from: accounts[0] })
                        .then(async (hash) => {
                            console.log(hash)
                            let data = await ipfs.files.get(hash)
                            console.log(JSON.stringify(data))
                            console.log(data.content)
                            res.json({ "status": "success", data: data.content })
                        })
                } else {
                    res.status(400).json({ "status": "Failed", "reason": "wrong input1" })
                }
            })
        } else {
            res.status(400).json({ "status": "Failed", "reason": "wrong input2" })
        }
    })
}

module.exports = routes