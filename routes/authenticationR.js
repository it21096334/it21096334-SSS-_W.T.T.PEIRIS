/*const express = require('express');
const router = express.Router();
const Authentication = require('../models/authentication');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
//const { secretKey, tokenExpiration } = require('../config');

// Authenticate user and generate token
router.post('/auth', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ username });

    // User not found or invalid password
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: tokenExpiration });

    // Create authentication entry
    const authentication = new Authentication({
      user: user._id,
      token,
      expiresAt: new Date(Date.now() + tokenExpiration * 1000)
    });
    await authentication.save();

    // Return token and user information
    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

// Logout user by invalidating token
router.delete('/', async (req, res) => {
  const token = req.headers.authorization;

  try {
    // Find the authentication entry for the token
    const authentication = await Authentication.findOne({ token });

    // Authentication not found
    if (!authentication) {
      return res.status(404).json({ error: 'Invalid token' });
    }

    // Delete the authentication entry
    await authentication.remove();

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout user' });
  }
});

module.exports = router;
*/
/*


const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Authentication = require('../models/authentication');

// Route to validate login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Validate the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create a new authentication entry
    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // Token expires in 1 hour

    const authentication = new Authentication({
      user: user._id,
      token,
      expiresAt
    });
    await authentication.save();

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to logout and delete the token
router.post('/logout', async (req, res) => {
  try {
    const { token } = req.body;

    // Find the authentication entry with the provided token
    const authentication = await Authentication.findOne({ token });

    if (!authentication) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Delete the authentication entry
    await authentication.deleteOne();

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

*/



const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Authentication = require('../models/authentication');

// Route to validate login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Validate the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create a new authentication entry
    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // Token expires in 1 hour

    const authentication = new Authentication({
      user: user._id,
      token,
      expiresAt,
      loggedInAt: Date.now()
    });
    await authentication.save();

    res.status(200).json({
      success: true,
      data: user,
      message: 'Login successful'});
  } catch (error) {
    console.error(error);
    res.status(200).json({
      success: false,
      data: error,
      message: 'Login successful'});

  }
});


// Route to logout
router.post('/logout', async (req, res) => {
  try {
    const { token } = req.body;

    // Update the loggedInAt field to mark the logout time
    await Authentication.findOneAndUpdate({ token }, { $set: { loggedInAt: null } });

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
