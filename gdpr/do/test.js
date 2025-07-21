const EthCrypto = require("eth-crypto");
const crypto = require("crypto");
const assert = require('assert');
// const Proxy = require("./index").Proxy;
const PRE = require("./functions/encryption");
const Proxy = PRE.Proxy;
// let elliptic = require('elliptic');
let sha3 = require('js-sha3');
// let ec = new elliptic.ec('secp256k1');
let secp = require("noble-secp256k1");
function test() {
console.log("Testing for proxy reencryptionn!!!!!")

var kp_A = Proxy.generate_key_pair();
var sk_A = Proxy.to_hex(kp_A.get_private_key().to_bytes());
const pk_A = Proxy.to_hex(kp_A.get_public_key().to_bytes());

console.log(kp_A)
console.log("sk_A : " + sk_A)
console.log("sk_A : " + pk_A)

const sk_A2 = crypto.randomBytes(32).toString("hex");
const pk_A2 = EthCrypto.publicKeyByPrivateKey(sk_A);

console.log("sk_A2 : "+sk_A2)
console.log("pk_A2 : " + pk_A2)

let obj = PRE.encryptData(pk_A, "test data")
    // console.log("pk : "+pk_A)
    // console.log("sk : "+sk_A)

    var kp_B = Proxy.generate_key_pair();
    var sk_B = Proxy.to_hex(kp_B.get_private_key().to_bytes());
    var pk_B = Proxy.to_hex(kp_B.get_public_key().to_bytes());
    
    console.log(kp_B)
    console.log("sk_B = " + sk_B)
    console.log("pk_B = " + pk_B)

    const sk_B2 = crypto.randomBytes(32).toString("hex");
    const pk_B2 = EthCrypto.publicKeyByPrivateKey(sk_B);
    
    console.log(sk_B2)
    console.log(pk_B2)

    console.log("ENCrypted data : ")
    console.log(obj)
    
    let rk = PRE.generateReEncrytionKey(sk_A, pk_B);
    // console.log(rk)
    let obj3 = PRE.reEncryption(rk, obj)
    // console.log(PRE.reEncryption(rk, obj))
    // console.log(obj2)
    let decryptData = PRE.decryptData(sk_B, obj)
    console.log("decryptData = "+decryptData)
    let message = "hello";
    let msgHash = sha3.keccak256(message);
    console.log("msg hash = "+msgHash)
    const signature = secp.sign(msgHash, sk_A);
    console.log("signature ="+ signature);
    // const isSigned = secp.verify(signature, msgHash, publicKey);
    // console.log(isSigned)

    
const address = EthCrypto.publicKey.toAddress(pk_A);
const hash = EthCrypto.hash.keccak256 (message);
const signature2 = EthCrypto.sign(sk_A, hash);



console.log(` Signer address ${address}\n`);
console.log(`Message: ${message}\n`);
console.log(`Hash: ${hash}\n`);
console.log(`Signature: ${signature2}\n`);
console.log(`--- Now checking signature ---`);
const signer = EthCrypto.recoverPublicKey(signature2, hash);
console.log(`Public key recovered: ${signer}`);
const signerAddress = EthCrypto.recover(signature2,hash);
console.log(`Sender (recovered): ${signerAddress}`);



}

async function test_PR(){
//    encrypted_data = {
//     key: '049aadeedcddea43cd47a53c060905c9c96b1a144ef6b64c0c145c690005daec537f92f004d095a36a0fe0e0235c85b0de021804832110be9b9e1707c98660f366042b494ae51843cae31eccad7ec9bea78c0ad45da0647b309886da8e35d5598a9ba5825dc87e4f6ff35efade336a8fd2a2000043913c59e0ea4546ba21da7fc8e4e8f5fe847a53e6cdeb04bcc00c68972e0776b7598fa3b35df23eb6d13b9eaeb0',
//     cipher: 'ktkunni6Gmj6IYerPvnFCw=='
//   }
   encrypted_data = {
    key: '04c43bd53b1652356137c1ae33b0293c585395734dee401b53d4ba6a6daa7fa765c98a0c1a43cc2781bed787277393edc220c94de0722b52feeb15f18540b1a9a704080fb7af1d0a100298266ca716f27f22cd083dc2c862c17e8e2c8d017d261e75b70829a5d5779f40e478d008f254dfd60cdeb5ad88711eb29da872171cd6f9edc52afd0d823751d480077b79de2b6de278b92364b11b5200c17cc62282055e99',
    cipher: 'HL3XAQx0fI7A45KItgNMtA=='
  }

//   decrypted_Datas_PRIVATE_KEY = '80d31345b58020e9e798f95c5b8a80589f4b6d78f32e4ff4a00c80a063467e00';
  decrypted_Datas_PRIVATE_KEY = '0395dc82a873f3ad80d1cede1da1eb7fb4a74139a88364da7f3756fd86601b9e';

//   du_public_key = '04fcf073f4d74c8eaea520143186c621dd63fe393b973d0cf2df569e51ad9846891f6e7a6c616786f09ce018709434c497484e7780c90ba65ff490576a3e71759d';
  du_public_key = '049b47607924fa3226d26784e0ed9d517e1c2fddb5f39d63157313c4c1d3dbbb3999263333be72b4bdf85fc6e2107ca6ea58bfc5117ce919876546ba6bcda2de85';
//   du_private_key = '5bf39661ebc759960a517a29d27b3ca26af58cc3cb828c579bb5e5ac1861862a';
  du_private_key = '26d8205807655d74845d4c6f8d7353d6bbfc6ea7c826cbb8e01ca7e5b853cdcc';
//   0395dc82a873f3ad80d1cede1da1eb7fb4a74139a88364da7f3756fd86601b9e
//   80d31345b58020e9e798f95c5b8a80589f4b6d78f32e4ff4a00c80a063467e00
//   04fcf073f4d74c8eaea520143186c621dd63fe393b973d0cf2df569e51ad9846891f6e7a6c616786f09ce018709434c497484e7780c90ba65ff490576a3e71759d



  let rk = PRE.generateReEncrytionKey(decrypted_Datas_PRIVATE_KEY, du_public_key);

// console.log("rk")
// console.log(rk)
console.log(encrypted_data);


obj = PRE.reEncryption(rk, encrypted_data)

console.log("encrypted_data");
console.log(encrypted_data);
let decryptData = PRE.decryptData(du_private_key, encrypted_data)
console.log("rk")  
console.log(rk)  
console.log("obj")  
console.log(obj)  
console.log(decryptData);

    

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
        console.log("signature = "+ signature);
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
test_PR()
async function signature(){
console.log("Testing for signature and signature verification!!!!!")

var message="Hello";
// console.log(message);
var kp_A = Proxy.generate_key_pair();

const privateKey = crypto.randomBytes(32).toString("hex");
// const privateKey = Proxy.to_hex(kp_A.get_private_key().to_bytes());
const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
// const publicKey = Proxy.to_hex(kp_A.get_public_key().to_bytes());

const address = EthCrypto.publicKey.toAddress(publicKey);
const hash = EthCrypto.hash.keccak256 (message);
const signature = EthCrypto.sign(privateKey, hash);


console.log(`Private key: ${privateKey}\n`);
console.log(` Public key: ${publicKey}\n`);
console.log(` Signer address ${address}\n`);
console.log(`Message: ${message}\n`);
console.log(`Hash: ${hash}\n`);
console.log(`Signature: ${signature}\n`);
console.log(`--- Now checking signature ---`);
const signer = EthCrypto.recoverPublicKey(signature, hash);
console.log(`Public key recovered: ${signer}`);
const signerAddress = EthCrypto.recover(signature,hash);
console.log(`Sender (recovered): ${signerAddress}`);
console.log("\n\nNow we will encrypt ...");
const r = signature.slice(0, 66);
const s = "0x" + signature.slice(66, 130);
const v = parseInt(signature.slice(130, 132), 16);
console.log({ r, s, v });
}
// go();
async function go() {
    let cipher = await EthCrypto.encryptWithPublicKey(publicKey,message); 
    console.log("Cipher: ",cipher)
    let plain = await EthCrypto.decryptWithPrivateKey(privateKey,cipher);
    console.log("Decryption: ",plain)
 }