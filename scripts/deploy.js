const hre = require("hardhat");
async function main() {
    // Get the deployer account from Hardhat
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // Get the contract factory and deploy
    const MessageStorage = await ethers.getContractFactory("MessageStorage");
    const messageStorage = await MessageStorage.deploy();
    await messageStorage.deployed();

    console.log("MessageStorage deployed to:", messageStorage.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });