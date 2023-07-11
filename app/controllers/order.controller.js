const db = require("../models");
const Order = db.order;
const Customer = db.customer;
const Op = db.Sequelize.Op;
// Create and Save a new Order
exports.create = (req, res) => {
  console.log(req);
  // Validate request
  if (req.body.pickupTime === undefined) {
    const error = new Error("Pickup Time cannot be empty for Order!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.deliveryTime === undefined) {
    const error = new Error("Delivery Time cannot be empty for Order!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.blocks === undefined) {
    const error = new Error("Blocks cannot be empty for Order!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.quotedPrice === undefined) {
    const error = new Error("Quoted Price cannot be empty for Order!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.customerId === undefined) {
    const error = new Error("Customer cannot be empty for Order!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.deliverToCustomerId === undefined) {
    const error = new Error("Deliver To Customer cannot be empty for Order!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.userId === undefined) {
    const error = new Error("User Id cannot be empty for Order!");
    error.statusCode = 400;
    throw error;
  }

  // Create a Order
  const order = {
    pickupTime: req.body.pickupTime,
    finalBill: req.body.finalBill,
    deliveryTime: req.body.deliveryTime,
    blocks: req.body.blocks,
    quotedPrice: req.body.quotedPrice,
    customerId: req.body.customerId,
    deliverToCustomerId: req.body.deliverToCustomerId,
    userId: req.body.userId,
  };
  // Save Order in the database
  Order.create(order)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Order.",
      });
    });
};

// Find all Orders
exports.findAll = (req, res) => {
  Order.findAll({
    order: [
      ["deliveryTime", "DESC"],
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find all Orders.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error retrieving Orders.",
      });
    });
};

// Find a single Order with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Order.findOne({
    where: { id: id },
    include: [
      {
        model: Customer,
        as: "customer",
        required: false,
      },
      {
        model: Customer,
        as: "deliverToCustomer",
        required: false,
      },
    ]
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Order with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Order with id=" + id,
      });
    });
};
// Update a Order by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Order.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Order was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Order with id=" + id,
      });
    });
};
// Delete a Order with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Order.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Order was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Order with id=${id}. Maybe Order was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Order with id=" + id,
      });
    });
};
// Delete all Orders from the database.
exports.deleteAll = (req, res) => {
  Order.destroy({
    where: {},
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} Orders were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Orders.",
      });
    });
};
