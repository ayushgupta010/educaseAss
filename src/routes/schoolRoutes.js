const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const schoolController = require('../controllers/schoolController');

// Test Database Connection Route
router.get('/test-connection', async (req, res) => {
  try {
    console.log('Testing database connection...');
    const pool = require('../config/database');
    
    console.log('Executing test query...');
    const [result] = await pool.execute('SELECT 1');
    
    console.log('Query result:', result);
    res.json({
      success: true,
      message: 'Database connection successful!',
      data: result
    });
  } catch (error) {
    console.error('Database connection error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    res.status(500).json({
      success: false,
      message: 'Database connection failed!',
      error: error.message,
      details: {
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState
      }
    });
  }
});

// Add School Route
router.post('/addSchool',
  [
    body('name').notEmpty().trim().escape(),
    body('address').notEmpty().trim().escape(),
    body('latitude').isFloat({ min: -90, max: 90 }),
    body('longitude').isFloat({ min: -180, max: 180 })
  ],
  schoolController.addSchool
);

// List Schools Route
router.get('/listSchools',
  [
    query('latitude').isFloat({ min: -90, max: 90 }),
    query('longitude').isFloat({ min: -180, max: 180 })
  ],
  schoolController.listSchools
);

module.exports = router; 