const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const os = require('os');
const { loginUser } = require('./authController');

dotenv.config();  // Load .env file
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define routes
app.post('/auth/login', loginUser);

// Get the network IP address of the machine
const getNetworkIP = () => {
    const networkInterfaces = os.networkInterfaces();
    let ip = 'localhost';

    // Loop through network interfaces and get the first IPv4 address
    for (const interfaceKey in networkInterfaces) {
        if (networkInterfaces.hasOwnProperty(interfaceKey)) {
            const interfaceInfo = networkInterfaces[interfaceKey];

            for (let i = 0; i < interfaceInfo.length; i++) {
                const address = interfaceInfo[i];
                if (address.family === 'IPv4' && !address.internal) {
                    ip = address.address;
                    break;
                }
            }
        }
    }

    return ip;
};

// Start server and log network IP
app.listen(port, () => {
    const networkIP = getNetworkIP();
    console.log(`Server running at http://${networkIP}:${port}`);
});
