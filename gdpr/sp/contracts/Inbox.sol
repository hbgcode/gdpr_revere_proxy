pragma solidity ^0.5.2;
contract Inbox{
       constructor() public{}

    function recover(bytes32 hash, bytes memory signature) public pure returns (address) {
        // Check the signature length
        if (signature.length != 65) {
            return (address(0));
        }
        // Divide the signature in r, s and v variables
        bytes32 r;
        bytes32 s;
        uint8 v;
        // ecrecover takes the signature parameters, and the only way to get them
        // currently is to use assembly.
        // solhint-disable-next-line no-inline-assembly
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }
          if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
            return address(0);
        }
        if (v != 27 && v != 28) {
            return address(0);
        }
        // If the signature is valid (and not malleable), return the signer address
        return ecrecover(hash, v, r, s);
    }
    function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }
    // }
    //Structure
    mapping (string=>string) public ipfsInbox;
    mapping (string=>bytes) public duData;
    mapping (string=>bytes) public doData;
    mapping (string=>bytes) public spData;
    //Events
    event ipfsSent(string _ipfsHash, string _address);
    event duSent(string _du, bytes _duPk);
    event doSent(string _do, bytes _doPk);
    event spSent(string _sp, bytes _spPk);
    event inboxResponse(string response);
 
    //Modifiers
    modifier notFull (string memory _string) {
    bytes memory stringTest = bytes(_string); 
    require(stringTest.length==0); 
    _;
    }

    modifier notFull2(bytes memory _string) {
    bytes memory stringTest = bytes(_string); 
    require(stringTest.length==0); 
    _;
    }
    // An empty constructor that creates an instance of the conteact
    function concatenate(string memory a,string memory b) public pure returns (string memory){
        return string(abi.encodePacked(a,'.',b));
    } 
function getAddressFromPublicKey(bytes memory _publicKey) public pure returns (address) {
    // Get address from public key
    bytes32 keyHash = keccak256(_publicKey);
    uint result = 0;
    for (uint i = keyHash.length-1; i+1 > 12; i--) {
      uint c = uint(uint8(keyHash[i]));
      uint to_inc = c * ( 16 ** ((keyHash.length - i-1) * 2));
      result += to_inc;
    }
    return address(result);
}
    //takes in receiver's address and IPFS hash. Places the IPFSadress in the receiver's inbox
function sendIPFS(string memory _address, string memory _ipfsHash) notFull(ipfsInbox[_address]) public{
        ipfsInbox[_address] = _ipfsHash;
        emit ipfsSent(_ipfsHash, _address);
    }
    //retrieves hash
function getHash(string memory _address) public view returns(string memory) {
        string memory ipfs_hash=ipfsInbox[_address];
         //emit inboxResponse(ipfs_hash);
        return ipfs_hash;
    }
function store_du( string memory _du, bytes memory _duPk) notFull2(duData[_du]) public {
        duData[concatenate(_du,'publicKey')] = _duPk ;
        emit duSent(_du, _duPk);
            }   
function get_du(string memory _du) public view returns ( bytes memory) {
    bytes memory duPk=duData[_du];
         //emit inboxResponse(ipfs_hash);
        return duPk;
         }
function store_do( string memory _do  , bytes memory _doPk) notFull2(doData[_do]) public {
    doData[concatenate(_do,'publicKey')] = _doPk ;
    emit doSent(_do, _doPk);
            }
function get_do(string memory _do) public view returns ( bytes memory) {
    bytes memory doPk=doData[_do];
         //emit inboxResponse(ipfs_hash);
        return doPk;
         }
function store_sp( string memory _sp  , bytes memory _spPk) notFull2(spData[_sp]) public {
        spData[concatenate(_sp,'publicKey')] = _spPk;
        emit spSent(_sp, _spPk);
            }
function get_sp(string memory _sp) public view returns ( bytes memory) {
    bytes memory spPk=spData[_sp];
        return spPk;
         }

    event signer(address , address , address );   
    event publickey(bytes , bytes , bytes );
    event sign2(address, address, address);

function request_data(bytes32 _hasheddu,bytes32 _hasheddo,bytes32 _hashedsp, bytes memory signatureDu , bytes memory signatureDo , bytes memory signatureSp ) public view returns (uint256){
    address du_Signer = recover(_hasheddu, signatureDu);
    address do_Signer = recover(_hasheddo, signatureDo);
    address sp_Signer = recover(_hashedsp, signatureSp);
    // emit publickey(get_du("user.publicKey") , get_do("user.publicKey") , get_sp("user.publicKey") );
    // emit signer(du_Signer , do_Signer , sp_Signer );
    address du_publicKey = getAddressFromPublicKey(get_du("user.publicKey"));
    address do_publicKey = getAddressFromPublicKey(get_do("user.publicKey"));
    address sp_publicKey = getAddressFromPublicKey(get_sp("user.publicKey"));
    // emit sign2(du_publicKey, do_publicKey, sp_publicKey);
    if(du_publicKey == du_Signer && do_publicKey == do_Signer && sp_publicKey == sp_Signer )
        {return now;}
        else{return 0;}
    }

  function tokenVerify(uint256 time) public view returns(string memory){
      if(now - time <= 60){
          return "ok";
      }
      else{
          return "fail";
      }
  }
  int private count = 0;
function incrementCounter() public {
    count += 1;
}

  function gettime() public view returns(uint256){
     return now;
  }               
}