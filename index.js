const express = require('express');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

//mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });//

//mongoose.connect('mongodb+srv://clementsanchez31:clementsanchez31@myflixdb.imdmhry.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });//

/* mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); */

// MongoDB connection
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
 
//const connectionUri = process.env.CONNECTION_URI;//

/* mongoose.connect(connectionUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  }); 
 */
 

const morgan = require('morgan');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT|| 8080;

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Middleware to log all requests
app.use(morgan('common'));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());




/* rest of code goes here*/

// Authentication setup
let auth = require('./auth')(app);

// Assuming you have a passport.js file for JWT strategy
const passport = require('passport');
require('./passport');



// Routes

// Endpoint to get all genres
app.get('/genre', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.distinct('genre.name')
    .then((genre) => {
      res.status(200).json(genre);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


// Get all movies with JWT authentication
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
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
  await Movies.findOne({ title: req.params.title })
    .then((movie) => {
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).send('Movie not found');
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


// Get a genre by name with JWT authentication
app.get('/genre/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find({ 'genre.name': req.params.name })
    .then((movies) => {
      if (movies.length > 0) {
        res.json(movies);
      } else {
        res.status(404).send('Genre not found');
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get a director by name with JWT authentication
app.get('/director/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movies.find({ 'director.name': req.params.name });
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
app.put('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  // CONDITION TO CHECK ADDED HERE
  if(req.user.Username !== req.params.username){
      return res.status(400).send('Permission denied');
  }
  // CONDITION ENDS
  await Users.findOneAndUpdate({ username: req.params.username }, {
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
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});