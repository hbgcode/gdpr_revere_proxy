// const Proxy = require("./index").Proxy;
const PRE = require("./functions/encryption");
const Proxy = PRE.Proxy;
// let elliptic = require('elliptic');
let sha3 = require('js-sha3');
// let ec = new elliptic.ec('secp256k1');
let secp = require("noble-secp256k1");
// function test() {
//     console.log("Testing for proxy reencryptionn!!!!!")
//     var kp_A = Proxy.generate_key_pair();
//     var sk_A = Proxy.to_hex(kp_A.get_private_key().to_bytes());
//     var pk_A = Proxy.to_hex(kp_A.get_public_key().to_bytes());
//     console.log("pk : "+pk_A)
//     console.log("sk : "+sk_A)
//     // console.log(PRE)
//     var kp_B = Proxy.generate_key_pair();
//     var sk_B = Proxy.to_hex(kp_B.get_private_key().to_bytes());
//     var pk_B = Proxy.to_hex(kp_B.get_public_key().to_bytes());
//     let obj = PRE.encryptData(pk_A, "test data")
//     console.log("ENCrypted data : ")
//     console.log(obj)
//     console.log(JSON.stringify(obj))
//     let obj5 = JSON.stringify(obj)
//     let obj4 = JSON.parse(obj5)
//     console.log("obj4")
//     // console.log(obj4)
//     // console.log(obj);
//     let rk = PRE.generateReEncrytionKey(sk_A, pk_B);
//     console.log(rk)
//     let obj3 = PRE.reEncryption(rk, obj4)
//     // console.log(PRE.reEncryption(rk, obj))
//     // console.log(obj2)
//     let decryptData = PRE.decryptData(sk_B, obj4)
//     console.log(decryptData)
// }

// async function test_PR(){
//    encrypted_data = {
//     key: '049aadeedcddea43cd47a53c060905c9c96b1a144ef6b64c0c145c690005daec537f92f004d095a36a0fe0e0235c85b0de021804832110be9b9e1707c98660f366042b494ae51843cae31eccad7ec9bea78c0ad45da0647b309886da8e35d5598a9ba5825dc87e4f6ff35efade336a8fd2a2000043913c59e0ea4546ba21da7fc8e4e8f5fe847a53e6cdeb04bcc00c68972e0776b7598fa3b35df23eb6d13b9eaeb0',
//     cipher: 'ktkunni6Gmj6IYerPvnFCw=='
//   }

//   decrypted_Datas_PRIVATE_KEY = '80d31345b58020e9e798f95c5b8a80589f4b6d78f32e4ff4a00c80a063467e00';

//   du_public_key = '04fcf073f4d74c8eaea520143186c621dd63fe393b973d0cf2df569e51ad9846891f6e7a6c616786f09ce018709434c497484e7780c90ba65ff490576a3e71759d';
//   du_private_key = '5bf39661ebc759960a517a29d27b3ca26af58cc3cb828c579bb5e5ac1861862a';



//   let rk = PRE.generateReEncrytionKey(decrypted_Datas_PRIVATE_KEY, du_public_key);

// PRE.reEncryption(rk, encrypted_data)

// let decryptData = PRE.decryptData(du_private_key, encrypted_data)
  
// console.log(decryptData);

    

// }


async function sign2(){
    console.log("Sign 2 start");
    // (async () => {
        // You pass either a hex string, or Uint8Array
        var kp_A = Proxy.generate_key_pair();
        // var sk_A = Proxy.to_hex(kp_A.get_private_key().to_bytes());
        var pk_A = Proxy.to_hex(kp_A.get_public_key().to_bytes());
        // const privateKey = "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";
        const privateKey = Proxy.to_hex(kp_A.get_private_key().to_bytes());
        // const messageHash = "a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28";
        // const publicKey = secp.getPublicKey(privateKey);
        const publicKey = Proxy.to_hex(kp_A.get_public_key().to_bytes());
        let msgHash = sha3.keccak256("hello");
        const signature = await secp.sign(msgHash, privateKey);
        console.log("signature ="+ signature);
        const isSigned = secp.verify(signature, msgHash, publicKey);
        // Supports Schnorr signatures
        const rpub = secp.schnorr.getPublicKey(privateKey);
        console.log("rPub : "+rpub);
        const rsignature = await secp.schnorr.sign(msgHash, privateKey);
        console.log("rSignature : "+rsignature);
        const risSigned = await secp.schnorr.verify(rsignature, msgHash, rpub);
        console.log("rsigned : "+risSigned);
        console.log("isSigned : "+isSigned)
    //   })();  
}
// test()
// sign2()
// test_PR()
console.log("Testing for signature and signature verification!!!!!")
const EthCrypto = require("eth-crypto");
const crypto = require("crypto");
const assert = require('assert');

var message="Hello";
// console.log(message);
var kp_A = Proxy.generate_key_pair();
// const privateKey = crypto.randomBytes(32).toString("hex");
const privateKeyA = Proxy.to_hex(kp_A.get_private_key().to_bytes());
const publicKeyA = EthCrypto.publicKeyByPrivateKey(privateKeyA);
// const publicKeyA = Proxy.to_hex(kp_A.get_public_key().to_bytes());

var kp_B = Proxy.generate_key_pair();
// const privateKey = crypto.randomBytes(32).toString("hex");
const privateKeyB = Proxy.to_hex(kp_B.get_private_key().to_bytes());
const publicKeyB = EthCrypto.publicKeyByPrivateKey(privateKeyB);
// const publicKeyB = Proxy.to_hex(kp_B.get_public_key().to_bytes());

var kp_C = Proxy.generate_key_pair();
// const privateKey = crypto.randomBytes(32).toString("hex");
const privateKeyC = Proxy.to_hex(kp_C.get_private_key().to_bytes());
const publicKeyC = EthCrypto.publicKeyByPrivateKey(privateKeyC);
// const publicKeyC = Proxy.to_hex(kp_C.get_public_key().to_bytes());


const addressA = EthCrypto.publicKey.toAddress(publicKeyA);
const addressB = EthCrypto.publicKey.toAddress(publicKeyB);
const addressC = EthCrypto.publicKey.toAddress(publicKeyC);

const hashA = EthCrypto.hash.keccak256 (message);
const hashB = EthCrypto.hash.keccak256 (publicKeyA);
const hashC = EthCrypto.hash.keccak256 (publicKeyC);

const signatureA = EthCrypto.sign(privateKeyA, hashA);
const signatureB = EthCrypto.sign(privateKeyB, hashB);
const signatureC = EthCrypto.sign(privateKeyC, hashC);


console.log(`Private key a: ${privateKeyA}\n`);
console.log(` Public key a: ${publicKeyA}\n`);
console.log(` Signer address a ${addressA}\n`);
console.log(`Message a: ${message}\n`);
console.log(`Hash a: ${hashA}\n`);
console.log(`Signature b: ${signatureA}\n`);

console.log(`Private key b: ${privateKeyB}\n`);
console.log(` Public key b: ${publicKeyB}\n`);
console.log(` Signer address b ${addressB}\n`);
console.log(`Hash b: ${hashB}\n`);
console.log(`Signature b: ${signatureB}\n`);

console.log(`Private key c: ${privateKeyC}\n`);
console.log(` Public key c: ${publicKeyC}\n`);
console.log(` Signer address c ${addressC}\n`);
console.log(`Hash c: ${hashC}\n`);
console.log(`Signature c: ${signatureC}\n`);



console.log(`--- Now checking signature ---`);
const signer = EthCrypto.recoverPublicKey(signatureA, hashA);
console.log(`Public key recovered: ${signer}`);
const signerAddress = EthCrypto.recover(signatureA,hashA);
console.log(`Sender (recovered): ${signerAddress}`);
// console.log("\n\nNow we will encrypt ...");

const r = signatureA.slice(0, 66);
const s = "0x" + signatureA.slice(66, 130);
const v = parseInt(signatureA.slice(130, 132), 16);
console.log({ r, s, v });
// go();
// async function go() {
//     let cipher = await EthCrypto.encryptWithPublicKey(publicKey,message); 
//     console.log("Cipher: ",cipher)
//     let plain = await EthCrypto.decryptWithPrivateKey(privateKey,cipher);
//     console.log("Decryption: ",plain)
//  }