require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const authRoutes = require('./routes/auth.routes');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on port ${port}`);
});
