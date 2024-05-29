const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = 8080; // Use a single port for the server

// Middleware to log all requests
app.use(morgan('common'));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Routes
// Create a GET route for /movies that returns a JSON object containing data about your top 10 movies
app.get('/movies', (req, res) => {
  res.json([
    { title: "A Clockwork Orange", year: 1971 },
    { title: "Old Boy", year: 2003 },
    { title: "Castaway on the Moon", year: 2009 },
    { title: "Star Wars - A New Hope", year: 1977 },
    { title: "Schindler's List", year: 1993 },
    { title: "The Lord of the Rings: The Return of the King", year: 2003 },
    { title: "Pulp Fiction", year: 1994 },
    { title: "The Good, the Bad and the Ugly", year: 1966 },
    { title: "Fight Club", year: 1999 },
    { title: "Forrest Gump", year: 1994 }
  ]);
});

// GET route for the home page
app.get('/', (req, res) => {
  res.send('Welcome to My Movie App!');
});

// Get a single movie by title
app.get('/movies/:title', (req, res) => {
  res.send(`GET request returning data for movie: ${req.params.title}`);
});

// Get a genre by name
app.get('/genres/:name', (req, res) => {
  res.send(`GET request returning data for genre: ${req.params.name}`);
});

// Get a director by name
app.get('/directors/:name', (req, res) => {
  res.send(`GET request returning data for director: ${req.params.name}`);
});

// Register a new user
app.post('/users', (req, res) => {
  res.send('POST request to register a new user');
});

// Update user info
app.put('/users/:userId', (req, res) => {
  res.send(`PUT request to update user: ${req.params.userId}`);
});

// Add a movie to user's favorites
app.post('/users/:userId/favorites', (req, res) => {
  res.send('POST request to add a movie to user\'s favorites');
});

// Remove a movie from user's favorites
app.delete('/users/:userId/favorites/:movieId', (req, res) => {
  res.send(`DELETE request to remove movie: ${req.params.movieId} from user: ${req.params.userId}'s favorites`);
});

// Deregister a user
app.delete('/users/:userId', (req, res) => {
  res.send(`DELETE request to remove user: ${req.params.userId}`);
});

// Error-handling middleware function to log all application-level errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
