// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MessageStorage {
    address public owner;
    string private message;
    event MessageStored(string newMessage);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function storeMessage(string memory _message) public onlyOwner {
        message = _message;
        emit MessageStored(_message);
    }

    function retrieveMessage() public view returns (string memory) {
        return message;
    }
}
