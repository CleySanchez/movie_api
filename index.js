const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Use morgan middleware to log all requests
app.use(morgan('common'));

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

// Create another GET route for / that returns a default textual response
app.get('/', (req, res) => {
  res.send('Welcome to My Movie App!');
});

// Use express.static to serve the documentation.html file from the public folder
app.use(express.static('public'));

// Error-handling middleware function to log all application-level errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
