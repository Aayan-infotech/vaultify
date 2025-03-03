# AWS Secrets Manager 

A Node.js application that demonstrates how to fetch secrets from AWS Secrets Manager.

## Overview

This project provides a simple API endpoint to retrieve secrets stored in AWS Secrets Manager. It's built using Node.js and Express, and uses the AWS SDK v3 to interact with AWS Secrets Manager.

## Prerequisites

- Node.js installed on your machine
- AWS account with access to Secrets Manager
- AWS credentials (Access Key and Secret Access Key)
- A secret stored in AWS Secrets Manager named "eg. secret-name"

## Project Structure 

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your AWS credentials:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

## Running the Application

Start the server:

```bash
npm start
```

The server will start on port 3000 (or the port specified in your environment variables).

## API Endpoints

### GET /secrets
Retrieves secrets from AWS Secrets Manager.

Response:
- Success: Returns a message confirming secrets were retrieved
- Error: Returns a 500 status code with error message

## Secret Format
The expected secret format in AWS Secrets Manager:

## Security Considerations

- Never commit `.env` file or AWS credentials
- Use IAM roles in production environments
- Implement proper authentication before deploying to production
- Keep your dependencies updated
- Follow AWS security best practices

## Error Handling

The application includes basic error handling for:
- AWS Secrets Manager connection issues
- Invalid secret format
- Server errors

## License

This project is licensed under the MIT License.
