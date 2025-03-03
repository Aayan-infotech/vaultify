const express = require('express');
const { getSecrets, getSpecificSecret } = require('./utils/secretsManager');

const app = express();
const port = process.env.PORT || 3000;

app.get('/secrets', async (req, res) => {
    try {
        const secrets = await getSecrets();
        console.log('Retrieved Secrets:', secrets);
        res.json({ message: 'Secrets retrieved successfully! Check console for details.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to retrieve secrets' });
    }
});

// New endpoint to demonstrate using specific secret
app.get('/token-uri', async (req, res) => {
    try {
        const tokenUri = await getSpecificSecret('token_uri');
        console.log('Token URI:', tokenUri); // This will print: https://oauth2.googleapis.com/token
        
        // Example of using the secret
        res.json({
            message: 'Token URI retrieved successfully',
            endpoint: tokenUri
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to retrieve token URI' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 