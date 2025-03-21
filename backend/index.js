// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Allow cross-origin requests from the frontend
const bodyParser = require('body-parser');

// Import any additional libraries (e.g., ethers) and your smart contract logic here.
const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Allow requests from your frontend (e.g., http://localhost:3000)
app.use(cors());
app.use(bodyParser.json());

// --- Example: Connect to your deployed smart contract ---
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractArtifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'MessageStorage.sol', 'MessageStorage.json');
const contractArtifact = JSON.parse(fs.readFileSync(contractArtifactPath, 'utf8'));
const contractABI = contractArtifact.abi;
const contractAddress = process.env.CONTRACT_ADDRESS;
const messageStorageContract = new ethers.Contract(contractAddress, contractABI, wallet);

// Example API Endpoint: Retrieve message from smart contract
app.get('/message', async(req, res) => {
    try {
        const message = await messageStorageContract.retrieveMessage();
        res.json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving message");
    }
});

// Example API Endpoint: Store message to smart contract
app.post('/message', async(req, res) => {
    const { newMessage } = req.body;
    if (!newMessage) {
        return res.status(400).send("newMessage is required");
    }
    try {
        const tx = await messageStorageContract.storeMessage(newMessage);
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error storing message");
    }
});

// Start the backend server
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});