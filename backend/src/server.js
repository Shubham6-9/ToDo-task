require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const errorHandler = require('./middleware/error');

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
});
