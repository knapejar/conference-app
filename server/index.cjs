const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Routes
app.use('/api/images', require('./routes/images.cjs'));
// ... existing code ... 