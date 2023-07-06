require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require('multer');

const upload = multer({dest: 'uploads/'});
const app = express();

const db = require("./app/models");

db.sequelize.sync();

var corsOptions = {
  origin: "http://localhost:8082",
};

app.use(cors(corsOptions));
app.options("*", cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the acme  backend." });
});

app.post('/photo/upload', upload.single('file'), (req, res) => {

});

require("./app/routes/auth.routes.js")(app);
require("./app/routes/itinerary.routes")(app);
require("./app/routes/itineraryDay.routes")(app);
require("./app/routes/hotel.routes")(app);
require("./app/routes/site.routes")(app);
require("./app/routes/customer.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3202;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

module.exports = app;
