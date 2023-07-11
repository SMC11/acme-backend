module.exports = (app) => {
  const Order = require("../controllers/order.controller.js");
  const { authenticateRoute } = require("../authentication/authentication.js");
  var router = require("express").Router();

  // Create a new order
  router.post("/orders/", [authenticateRoute], Order.create);

  // Retrieve all Orders
  router.get("/orders/", Order.findAll);

  // Retrieve a single order with id
  router.get("/orders/:id", Order.findOne);

  // Update a order with id
  router.put("/orders/:id", [authenticateRoute], Order.update);

  // Delete a order with id
  router.delete("/orders/:id", [authenticateRoute], Order.delete);

  // Delete all Orders
  router.delete("/orders/", [authenticateRoute], Order.deleteAll);

  app.use("/acmeapi", router);
};
