const express = require('express');
const path = require('path'); // Import path module
const authRoutes = require('./routes/authRoutes');
const trainRoutes = require('./routes/trainRoutes');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.use('/auth', authRoutes);
app.use('/train', trainRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
