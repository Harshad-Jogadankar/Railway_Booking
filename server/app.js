const express = require('express');
const authRoutes = require('./routes/authRoutes');
const app = express();
const path = require('path');
app.use(express.json());
app.use('/api/auth', authRoutes); // Base route for auth
app.use(express.static(path.join(__dirname, '../client')));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
