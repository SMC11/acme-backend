module.exports = (app) => {
  const ItineraryDay = require("../controllers/itineraryDay.controller.js");
  const { authenticateRoute } = require("../authentication/authentication.js");
  var router = require("express").Router();

  // Create a new itineraryDay
  router.post("/itineraries/:itineraryId/itinerarydays", [authenticateRoute], ItineraryDay.create);

  // Retrieve all Itineraries Days
  router.get("/itineraries/:itineraryId/itinerarydays", ItineraryDay.findAll);

  // Retrieve a single itineraryDay with id
  router.get("/itineraries/:itineraryId/itinerarydays/:itineraryDayId", ItineraryDay.findOne);

  // Update a itineraryDay with id
  router.put("/itineraries/:itineraryId/itinerarydays/:itineraryDayId", [authenticateRoute], ItineraryDay.update);

  // Delete a itineraryDay with id
  router.delete("/itineraries/:itineraryId/itinerarydays/:itineraryDayId", [authenticateRoute], ItineraryDay.delete);

  // Delete all Itinerary Days
  router.delete("/itineraries/:itineraryId/itinerarydays", [authenticateRoute], ItineraryDay.deleteAll);

  app.use("/travelapi", router);
};
