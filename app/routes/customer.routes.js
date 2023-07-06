module.exports = (app) => {
    const Customer = require("../controllers/customer.controller.js");
    const { authenticateRoute } = require("../authentication/authentication.js");
    var router = require("express").Router();
  
    // Create a new customer
    router.post("/customers/", [authenticateRoute], Customer.create);
  
    // Retrieve all Customers
    router.get("/customers/", Customer.findAll);
  
    // Retrieve a single customer with id
    router.get("/customers/:id", Customer.findOne);
  
    // Update a customer with id
    router.put("/customers/:id", [authenticateRoute], Customer.update);
  
    // Delete a customer with id
    router.delete("/customers/:id", [authenticateRoute], Customer.delete);
  
    // Delete all Customers
    router.delete("/customers/", [authenticateRoute], Customer.deleteAll);
  
    app.use("/acmeapi", router);
  };
  