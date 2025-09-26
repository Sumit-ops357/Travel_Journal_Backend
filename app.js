const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
require('dotenv').config();

const { connectGridFS } = require('./db/gridFS');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB (for Mongoose models)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error(err));

// Connect to GridFS and start server only after it's ready
connectGridFS().then(() => {
  // Routes
  app.get('/', (req, res) => res.send('Crowdsourced Travel Journal API'));
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/journals', require('./routes/journals'));
  app.use('/api/photos', require('./routes/photos'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/ai', require('./routes/ai'));

  app.use(errorHandler);

  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}).catch((err) => {
  console.error('Failed to connect GridFS:', err);
  process.exit(1);
});


