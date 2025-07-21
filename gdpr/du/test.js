// const Proxy = require("./index").Proxy;
const PRE = require("./functions/encryption");
const Proxy = PRE.Proxy;
// let elliptic = require('elliptic');
let sha3 = require('js-sha3');
// let ec = new elliptic.ec('secp256k1');
let secp = require("noble-secp256k1");
const EthCrypto = require("eth-crypto");
const crypto = require("crypto");
const assert = require('assert');
function test() {
    let message = "hello";
    var kp_A = Proxy.generate_key_pair();
    var sk_A = Proxy.to_hex(kp_A.get_private_key().to_bytes());
    var pk_A = Proxy.to_hex(kp_A.get_public_key().to_bytes());
    console.log("pk : "+pk_A)
    console.log("sk : "+sk_A)
    // console.log(PRE)
    var kp_B = Proxy.generate_key_pair();
    var sk_B = Proxy.to_hex(kp_B.get_private_key().to_bytes());
    var pk_B = Proxy.to_hex(kp_B.get_public_key().to_bytes());
    let obj = PRE.encryptData(pk_A, "test data")
    
    console.log("ENCrypted data : ")
    console.log(obj)
    console.log(JSON.stringify(obj))
    let obj5 = JSON.stringify(obj)
    let obj4 = JSON.parse(obj5)
    let rk = PRE.generateReEncrytionKey(sk_A, pk_B);
    console.log("decrypted data = " + rk)
    PRE.reEncryption(rk, obj4)
    // console.log(PRE.reEncryption(rk, obj))
    // console.log(obj2)
    let decryptData = PRE.decryptData(sk_B, obj4)
    console.log("decrypted data = " + decryptData)

    const address = EthCrypto.publicKey.toAddress(pk_A);
const hash = EthCrypto.hash.keccak256 (message);
const signature = EthCrypto.sign(sk_A, hash);
console.log(`Private key: ${sk_A}\n`);
console.log(` Public key: ${pk_A}\n`);
console.log(` Signer address ${address}\n`);
console.log(`Message: ${message}\n`);
console.log(`Hash: ${hash}\n`);
console.log(`Signature: ${signature}\n`);
console.log(`--- Now checking signature ---`);
const signer = EthCrypto.recoverPublicKey(signature, hash);
console.log(`Public key recovered: ${signer}`);
const signerAddress = EthCrypto.recover(signature,hash);
console.log(`Sender (recovered): ${signerAddress}`);

}
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
test()
// sign2()s
// async function sig(){

// var message="Hello";
// // console.log(message);
// var kp_A = Proxy.generate_key_pair();
// const privateKey = crypto.randomBytes(32).toString("hex");
// // const privateKey = Proxy.to_hex(kp_A.get_private_key().to_bytes());
// const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
// // const publicKey = Proxy.to_hex(kp_A.get_public_key().to_bytes());
// const address = EthCrypto.publicKey.toAddress(publicKey);
// const hash = EthCrypto.hash.keccak256 (message);
// const signature = EthCrypto.sign(privateKey, hash);
// console.log(`Private key: ${privateKey}\n`);
// console.log(` Public key: ${publicKey}\n`);
// console.log(` Signer address ${address}\n`);
// console.log(`Message: ${message}\n`);
// console.log(`Hash: ${hash}\n`);
// console.log(`Signature: ${signature}\n`);
// console.log(`--- Now checking signature ---`);
// const signer = EthCrypto.recoverPublicKey(signature, hash);
// console.log(`Public key recovered: ${signer}`);
// const signerAddress = EthCrypto.recover(signature,hash);
// console.log(`Sender (recovered): ${signerAddress}`);
// console.log("\n\nNow we will encrypt ...");
// const r = signature.slice(0, 66);
// const s = "0x" + signature.slice(66, 130);
// const v = parseInt(signature.slice(130, 132), 16);
// console.log({ r, s, v });
// }
// sig();
// go();
// async function go() {
//     let cipher = await EthCrypto.encryptWithPublicKey(publicKey,message); 
//     console.log("Cipher: ",cipher)
//     let plain = await EthCrypto.decryptWithPrivateKey(privateKey,cipher);
//     console.log("Decryption: ",plain)
//  }