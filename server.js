const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static('.'));

// Create responses.txt if it doesn't exist
async function initializeResponsesFile() {
    try {
        await fs.access('responses.txt');
    } catch {
        // File doesn't exist, create it with a header
        await fs.writeFile('responses.txt', '=== Love Confession Responses ===\n\n');
    }
}

// Initialize the responses file when server starts
initializeResponsesFile();

// Endpoint to save response
app.post('/save-response', async (req, res) => {
    try {
        const { data } = req.body;
        await fs.appendFile('responses.txt', data);
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving response:', error);
        res.status(500).json({ success: false, error: 'Failed to save response' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 