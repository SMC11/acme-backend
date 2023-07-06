module.exports = (app) => {
  const Hotel = require("../controllers/hotel.controller.js");
  const { authenticateRoute } = require("../authentication/authentication.js");
  var router = require("express").Router();

  // Create a new hotel
  router.post("/hotels/", [authenticateRoute], Hotel.create);

  // Retrieve all Hotels for itineraryDay
  router.get(
    "/hotels/itineraryday/:itineraryDayId",
    [authenticateRoute],
    Hotel.findAllForItineraryDay
  );

  // Retrieve all Hotels
  router.get("/hotels/", Hotel.findAll);

  // Retrieve a single hotel with id
  router.get("/hotels/:id", Hotel.findOne);

  // Update a hotel with id
  router.put("/hotels/:id", [authenticateRoute], Hotel.update);

  // Delete a hotel with id
  router.delete("/hotels/:id", [authenticateRoute], Hotel.delete);

  // Delete all Hotels
  router.delete("/hotels/", [authenticateRoute], Hotel.deleteAll);

  app.use("/acmeapi", router);
};
