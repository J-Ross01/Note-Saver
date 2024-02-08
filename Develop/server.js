// Importing modules
const express = require('express');
const path = require('path');

// Importing routes
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// Creating an instance of express.
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded data.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serving static files from the 'public' directory.
app.use(express.static(path.join(__dirname, 'public')));

// Using routes from the api and html files. 
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// Starts the server. 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
