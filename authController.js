const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Fake users array (replace with database in production)
const users = [
    {
        id: "123",
        username: "john_doe",
        email: "john.doe@example.com",
        password: "$2b$12$vi625m995Z2oIpCtM7MEiuytx3Hnr.aqBdjKCgKLDC/vHoA52Zg7m",  // hashed password "password123"
        first_name: "John",
        last_name: "Doe",
        role: "user",
        profile_picture: "https://example.com/path/to/profile_picture.jpg"
    }
];

// Function to handle login
const loginUser = (req, res) => {
    const { username, password } = req.body;

    // Log the user's IP address
    const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Login attempt from IP: ${userIp}`);

    // Find user by username
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ status: "error", message: "Invalid username or password" });
    }

    // Check if the password is correct using bcrypt.compare
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
            return res.status(500).json({ status: "error", message: "Internal server error" });
        }

        if (!isMatch) {
            return res.status(400).json({ status: "error", message: "Invalid username or password" });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                profile_picture: user.profile_picture
            }
        };

        // Sign the JWT token with the secret key from .env
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Send response with the access token and user data
        return res.json({
            status: "success",
            message: "Login successful",
            data: {
                access_token: accessToken,
                user: payload.user
            }
        });
    });
};

module.exports = { loginUser };
