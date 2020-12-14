// Dependencies
// =============================================================
// const path = require("path");
// const fs = require("fs");
const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const db = require('./models');

const apiroutes = require('./routes/apiroutes');

// parse application/json
app.use(bodyParser.json())
//app.use(express.json()); // let express know that incomming/post is JSON
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
//app.use(express.urlencoded({ extended: true })); //required when taking data from HTML forms
app.use(express.static("public"));

app.use('/api', apiroutes);
const PORT = process.env.PORT || 8080;  // Heroku PORT config 


// Routes
// =============================================================
// const getIndexHTML = require("./routes/html/index");
// app.use("/", getIndexHTML);





// Listener 
// =============================================================

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log("App listening on PORT " + PORT);
    });

})

// module.exports = app;