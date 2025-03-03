const {
    SecretsManagerClient,
    GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');

const REGION = "us-east-1";
const SECRET_NAME = "secret-name";

const client = new SecretsManagerClient({
    region: REGION,
});

async function getSecrets() {
    try {
        const response = await client.send(
            new GetSecretValueCommand({
                SecretId: SECRET_NAME,
            })
        );
        
        // Parse the secret string to JSON
        const secrets = JSON.parse(response.SecretString);
        return secrets;
    } catch (error) {
        console.error('Error retrieving secrets:', error);
        throw error;
    }
}

module.exports = {
    getSecrets
}; 