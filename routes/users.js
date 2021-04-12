var express = require('express');
var router = express.Router();
const models = require('../models');
const bcrypt = require('bcrypt')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Check for username and password on request.
router.post('/register', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      error: 'Please include username and password.'
    })
  }

  // Check database for existing user.
  const user = await models.User.findOne({
    where: {
      username: req.body.username
    }
  })
  
  // If exists, send error.
  if (user) {
    return res.status(400).json({
      error: 'Username already in use.'
    })
  }
  
  // Hash password.
  const hash = await bcrypt.hash(req.body.password, 10)
  
  // Create user.
  const newUser = await models.User.create({
    username: req.body.username,
    password: hash
  })
  
  // Respond with success message.
  return res.status(201).json({})
});

  router.post('/login', async (req, res) => {
    // Check for username password.
    // If not there, send error.
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        error: 'Please include username and password.'
      });
    }

    // Find user from username.
    const user = await models.User.findOne({
      where: {
        username: req.body.username
      }
    })

    // If no user, send error.
    if (!user) {
      return res.status(404).json({
        error: 'No user with that username found.'
      })
    }

    // Check password.
    const match = await bcrypt.compare(req.body.password, user.password)
    
    // If not match, send error.
    if (!match) {
      return res.status(401).json({
        error: 'Password incorrect.'
      })
    }

    // Store user in session.
    req.session.user = user;

    // Respond with user info.
    res.json({
      id: user.id,
      username: user.username,
      updatedAt: user.updatedAt
    });
  });

  router.get('/logout', (req, res) => {
    // Clear user data from session.
    req.session.user = null;
    
    // Send success response.
    res.json({
      success: 'Logged out successfully.'
    })
  })

  router.get('/current', (req, res) => {
    const { user } = req.session;
    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        updatedAt: user.updatedAt
      });
    } else {
      res.status(401).json({
        error: 'Not Logged in'
      });
    }
  })

module.exports = router;
