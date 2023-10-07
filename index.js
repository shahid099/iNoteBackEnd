const express = require('express');
const cors = require('cors');
const detenv = require('dotenv').config();
// Importing Modules here.
const { dbConnect } = require('./dbConnection/dbConnection');
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT
dbConnect();

// Routes are here.
app.use('/inote', require('./routes/userLogin'));
app.use('/inote', require('./routes/notesRoute'));
// Dummy routes
app.get('/hallo', (req, res)=> {
  res.send("hallo");
})

// The server is build here.
app.listen(PORT, ()=> {
  console.log(`The server is listining at http://localhost:${PORT}`);
});