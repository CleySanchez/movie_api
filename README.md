# movie_api

🎬 My Movie App
My Movie App is a web application that allows users to browse and manage their favorite movies. The app provides a secure way to authenticate users using JWT and offers various endpoints for managing users, movies, genres, and directors.

🌟 Features

🔐 User registration and authentication (JWT-based)

🎥 Browse all movies

📜 Get details of a single movie by title

🎭 Get movies by genre or director

🛠 Update user information

❤️ Add and remove movies from user favorites

❌ Deregister a user

🛠 Technologies Used
Node.js
Express.js
MongoDB
Mongoose
Passport.js (for JWT authentication)
Express Validator (for input validation)
Morgan (for logging)
CORS (for handling Cross-Origin Resource Sharing)
Body-Parser (for parsing incoming request bodies)

🚀 Installation
Clone the repository:

git clone https://github.com/CleySanchez/movie_api
Navigate to the project directory:

cd my-movie-app

Install the dependencies:

npm install
Create a .env file in the root directory and add your MongoDB connection string and other environment variables:

makefile

CONNECTION_URI=your_mongodb_connection_string
PORT=your_port_number

🏃‍♂️ Running the App

Start the server:

npm start
The server will run on the specified port (default is 8080). You can access the API at http://localhost:8080.
📖 API Endpoints
🌐 Public Endpoints
Home
GET /: Welcome message for the app.
👤 User Endpoints
Register a new user

POST /users
Request body:
json

{
  "Username": "exampleUser",
  "Password": "examplePassword",
  "Email": "user@example.com",
  "Birthday": "1990-01-01"
}
Update user information

PUT /users/:username
Requires JWT authentication
Request body:
json

{
  "Username": "newUsername",
  "Password": "newPassword",
  "Email": "newEmail@example.com",
  "Birthday": "1990-01-01"
}
Add a movie to user’s favorites

POST /users/:userId/favorites/:movieId
Requires JWT authentication
Remove a movie from user’s favorites

DELETE /users/:userId/favorites/:movieId
Requires JWT authentication
Deregister a user

DELETE /users/:userId
Requires JWT authentication

🎥 Movie Endpoints

Get all movies

GET /movies
Requires JWT authentication
Get a single movie by title

GET /movies/:title
Requires JWT authentication

🎭 Genre Endpoints

Get all genres

GET /genre
Requires JWT authentication
Get movies by genre

GET /genre/:name
Requires JWT authentication

🎬 Director Endpoints

Get movies by director
GET /director/:name
Requires JWT authentication

⚠️ Error Handling

The app includes error-handling middleware to log all application-level errors and return a generic error message.

📝 Logging

Morgan is used to log all HTTP requests to the console.

📄 License

This project is licensed under the MIT License.

📬 Contact

If you have any questions or issues, please contact clement.sanchez.31@gmail.com.

