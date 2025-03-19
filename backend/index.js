// backend/index.js

require('dotenv').config();
const express = require('express');
const { JsonRpcProvider } = require("ethers");
const fs = require('fs');
const path = require('path');
const ethers = require("ethers");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(express.json());

console.log("RPC_URL:", process.env.RPC_URL);


// Set up ethers provider
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

// Create a wallet instance using a private key
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Load the contract's ABI
// Adjust the path based on where your compiled contract JSON is located
const contractArtifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'MessageStorage.sol', 'MessageStorage.json');
const contractArtifact = JSON.parse(fs.readFileSync(contractArtifactPath, 'utf8'));
const contractABI = contractArtifact.abi;

// Contract address should be set in your .env file after deployment
const contractAddress = process.env.CONTRACT_ADDRESS;

// Create a contract instance connected to the wallet
const messageStorageContract = new ethers.Contract(contractAddress, contractABI, wallet);

// API Endpoint: Get the stored message
app.get('/message', async(req, res) => {
    try {
        const message = await messageStorageContract.retrieveMessage();
        res.json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving message");
    }
});

// API Endpoint: Store a new message (POST)
app.post('/message', async(req, res) => {
    const { newMessage } = req.body;
    if (!newMessage) {
        return res.status(400).send("newMessage is required");
    }
    try {
        const tx = await messageStorageContract.storeMessage(newMessage);
        // Wait for the transaction to be mined
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error storing message");
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});