module.exports = (app) => {
  const Itinerary = require("../controllers/itinerary.controller.js");
  const { authenticateRoute } = require("../authentication/authentication.js");
  var router = require("express").Router();

  // Create a new itinerary
  router.post("/itineraries/", [authenticateRoute], Itinerary.create);

  // Retrieve all subscribed Itineraries for user
  router.get(
    "/itineraries/user/:userId",
    [authenticateRoute],
    Itinerary.findAllSubscribed
  );

  // Retrieve all Itineraries
  router.get("/itineraries/", Itinerary.findAll);

  // Retrieve a single itinerary with id
  router.get("/itineraries/:id", Itinerary.findOne);

  // Update a itinerary with id
  router.put("/itineraries/:id", [authenticateRoute], Itinerary.update);

  // Delete a itinerary with id
  router.delete("/itineraries/:id", [authenticateRoute], Itinerary.delete);

  // Delete all Itineraries
  router.delete("/itineraries/", [authenticateRoute], Itinerary.deleteAll);

  app.use("/acmeapi", router);
};
