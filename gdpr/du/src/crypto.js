const crypto = require("crypto");

var modulus=1024;
var type="rsa";
var message="hello";

var args = process.argv;
if (args.length>2) type=args[2];

var keyPair;

console.log('\n=== PEM format ===');

if (type=='rsa' || type=='dsa') {
  keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: modulus,
    publicKeyEncoding: { format: 'pem', type: 'spki' },
    privateKeyEncoding: { format: 'pem', type: 'pkcs8' }
    });


} else  {
    keyPair = crypto.generateKeyPairSync(type, {
        namedCurve:'secp256k1',
        publicKeyEncoding: { format: 'pem', type: 'spki' },
        privateKeyEncoding: { format: 'pem', type: 'pkcs8' }
    });

}

console.log('\n=== DER format ===');


console.log("Private key:\n",keyPair.privateKey);
console.log("Public key:\n",keyPair.publicKey);


if (type=='rsa' || type=='dsa') {
    keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: modulus,
      publicKeyEncoding: { format: 'der', type: 'spki' },
      privateKeyEncoding: { format: 'der', type: 'pkcs8' }
      });
  
  
  } else  {
      keyPair = crypto.generateKeyPairSync(type, {
          namedCurve:'secp256k1',
          publicKeyEncoding: { format: 'der', type: 'spki' },
          privateKeyEncoding: { format: 'der', type: 'pkcs8' }
      });
  
  }
  
  
  console.log("Private key:\n",keyPair.privateKey.toString('hex'));
  console.log("Public key:\n",keyPair.publicKey.toString('hex'));