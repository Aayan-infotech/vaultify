const express = require('express');
const { getSecrets } = require('./utils/secretsManager');

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 