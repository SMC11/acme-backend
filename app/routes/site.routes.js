module.exports = (app) => {
    const Site = require("../controllers/site.controller.js");
    const { authenticateRoute } = require("../authentication/authentication.js");
    var router = require("express").Router();
  
    // Create a new site
    router.post("/sites/", [authenticateRoute], Site.create);
  
    // Retrieve all Sites for itineraryDay
    router.get(
      "/sites/itinerarydayevent/:itineraryDayEventId",
      [authenticateRoute],
      Site.findAllForItineraryDayEvent
    );
  
    // Retrieve all Sites
    router.get("/sites/", Site.findAll);
  
    // Retrieve a single site with id
    router.get("/sites/:id", Site.findOne);
  
    // Update a site with id
    router.put("/sites/:id", [authenticateRoute], Site.update);
  
    // Delete a site with id
    router.delete("/sites/:id", [authenticateRoute], Site.delete);
  
    // Delete all Sites
    router.delete("/sites/", [authenticateRoute], Site.deleteAll);
  
    app.use("/travelapi", router);
  };
  