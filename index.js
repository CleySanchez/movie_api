const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

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
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movies.find({});
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching movies' });
  }
});

// Add a user
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: new Date(req.body.Birthday)
        })
        .then((user) => res.status(201).json(user))
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// GET route for the home page
app.get('/', (req, res) => {
  res.send('Welcome to My Movie App!!!');
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

// Update user info
app.put('/users/:userId', (req, res) => {
  res.send(`PUT request to update user: ${req.params.userId}`);
});

// Add a movie to user's favorites
app.post('/users/:userId/favorites', (req, res) => {
  res.send('POST request to add a movie to user\'s favorites');
});

// Update a user's favorites
app.put('/users/:userId/favorites/:movieId', (req, res) => {
  Users.findByIdAndUpdate(
    req.params.userId, 
    { $addToSet: { Favorites: req.params.movieId } }, 
    { new: true }, 
    (err, updatedUser) => {
      if (err) {
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
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
