const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
 

const app = express();
const port = 8080; // Use a single port for the server

// Middleware to log all requests
app.use(morgan('common'));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authentication setup
let auth = require('./auth')(app);

// Assuming you have a passport.js file for JWT strategy
const passport = require('passport');
require('./passport');

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Routes

// Get all movies with JWT authentication
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

// Get a single movie by title with JWT authentication
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await Movies.findOne({ Title: req.params.title });
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).send('Movie not found');
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the movie' });
  }
});

// Get a genre by name with JWT authentication
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movies.find({ 'Genre.Name': req.params.name });
    if (movies.length > 0) {
      res.json(movies);
    } else {
      res.status(404).send('Genre not found');
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the genre' });
  }
});

// Get a director by name with JWT authentication
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movies.find({ 'Director.Name': req.params.name });
    if (movies.length > 0) {
      res.json(movies);
    } else {
      res.status(404).send('Director not found');
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the director' });
  }
});

// Update user info with JWT authentication
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  // CONDITION TO CHECK ADDED HERE
  if(req.user.Username !== req.params.Username){
      return res.status(400).send('Permission denied');
  }
  // CONDITION ENDS
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
      }
  },
      { new: true }) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
          res.json(updatedUser);
      })
      .catch((err) => {
          console.log(err);
          res.status(500).send('Error: ' + err);
      })
});

// Add a movie to user's favorites with JWT authentication
app.post('/users/:userId/favorites/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { Favorites: req.params.movieId } },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the movie to favorites' });
  }
});

// Remove a movie from user's favorites with JWT authentication
app.delete('/users/:userId/favorites/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      req.params.userId,
      { $pull: { Favorites: req.params.movieId } },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while removing the movie from favorites' });
  }
});

// Deregister a user with JWT authentication
app.delete('/users/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    await Users.findByIdAndRemove(req.params.userId);
    res.status(200).send('User was deleted.');
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
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
