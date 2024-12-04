const express = require('express');
const cors = require('cors');
// const helmet = require('helmet');

const app = express();

// Middleware
app.use(cors());
// app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Error handling
// app.use(errorMiddleware);

module.exports = app;
