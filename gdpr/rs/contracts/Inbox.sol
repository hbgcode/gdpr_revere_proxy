pragma solidity ^0.5.2;
contract Inbox{
       constructor() public{}
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
    //Modifiers
    modifier notFull (string memory _string) {
    bytes memory stringTest = bytes(_string); 
    require(stringTest.length==0); 
    _;
    }
mapping (string=>string) public ipfsInbox;
event ipfsSent(string _ipfsHash, string _address); 
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

}