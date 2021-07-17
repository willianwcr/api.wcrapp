require('dotenv').config()

const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes'));
   
app.listen(8080, () => {
    console.log("Server running");
    //sendMessage('#figmaslacktest', 'Server is running');
});