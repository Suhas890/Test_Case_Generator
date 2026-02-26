const express = require('express');
const { generateTestCases, getHistory } = require('../controllers/testCaseController');

const router = express.Router();

router.post('/generate-testcases', generateTestCases);
router.get('/history', getHistory);

module.exports = router;