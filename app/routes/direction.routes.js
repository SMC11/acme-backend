module.exports = (app) => {
    const Direction = require("../controllers/direction.controller.js");
    var router = require("express").Router();
  
    // Retrieve Route
    router.get("/direction/:customerId/:deliverToCustomerId", Direction.findRoute);
  
    app.use("/acmeapi", router);
  };
  