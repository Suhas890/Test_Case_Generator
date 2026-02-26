const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const testCaseRoutes = require('./routes/testCaseRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rate limiting: 100 requests per 15 min
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use('/api', testCaseRoutes);

module.exports = app;