const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("MessageStorage", function() {
    it("Should store and retrieve a message", async function() {
        const MessageStorage = await ethers.getContractFactory("MessageStorage");
        const messageStorage = await MessageStorage.deploy();
        await messageStorage.deployed();

        const testMessage = "Hello, Blockchain!";
        await messageStorage.storeMessage(testMessage);
        const retrieved = await messageStorage.retrieveMessage();
        expect(retrieved).to.equal(testMessage);
    });

    it("Should emit MessageStored event when storing a message", async function() {
        const MessageStorage = await ethers.getContractFactory("MessageStorage");
        const messageStorage = await MessageStorage.deploy();
        await messageStorage.deployed();

        const testMessage = "Event Test";
        await expect(messageStorage.storeMessage(testMessage))
            .to.emit(messageStorage, "MessageStored")
            .withArgs(testMessage);
    });
});