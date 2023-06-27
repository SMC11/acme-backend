const db = require("../models");
const Hotel = db.hotel;
const Subscription = db.subscription;
const Op = db.Sequelize.Op;
// Create and Save a new Hotel
exports.create = (req, res) => {
  console.log(req);
  // Validate request
  if (req.body.name === undefined) {
    const error = new Error("Name cannot be empty for Hotel!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.address === undefined) {
    const error = new Error("Address cannot be empty for Hotel!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.phone === undefined) {
    const error = new Error("Phone cannot be empty for Hotel!");
    error.statusCode = 400;
    throw error;
  }else if (req.body.phone.length < 10) {
    const err = new Error("Phone cannot be less than 10 digits for Hotel!");
    err.statusCode = 500;
    res.status(err.statusCode).send({
      message:
        err.message || "Error retrieving Hotels.",
    });
    throw err;
  } else if (req.body.maps === undefined) {
    const error = new Error("Maps cannot be empty for Hotel!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.link === undefined) {
    const error = new Error("Link cannot be empty for Hotel!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.photo === undefined) {
    const error = new Error("Photo cannot be empty for Hotel!");
    error.statusCode = 400;
    throw error;
  }

  // Create a Hotel
  const hotel = {
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    maps: req.body.maps,
    link: req.body.link,
    photo: req.body.photo,
  };
  // Save Hotel in the database
  Hotel.create(hotel)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Hotel.",
      });
    });
};

// Find all Hotels
exports.findAll = (req, res) => {
  Hotel.findAll({
    order: [
      ["name", "ASC"],
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find all Hotels.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error retrieving Hotels.",
      });
    });
};

// Find Hotel for ItineraryDay
exports.findAllForItineraryDay = (req, res) => {
  const itineraryDayId = req.params.itineraryDayId;

  Subscription.findAll({
    where: { itineraryDayId: itineraryDayId },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Hotel for ItineraryDay.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Hotel for ItineraryDay.",
      });
    });
};

// Find a single Hotel with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Hotel.findAll({
    where: { id: id },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Hotel with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Hotel with id=" + id,
      });
    });
};
// Update a Hotel by the id in the request
exports.update = (req, res) => {
  if (req.body.phone.length < 10) {
    const err = new Error("Phone cannot be less than 10 digits for Hotel!");
    err.statusCode = 500;
    res.status(err.statusCode).send({
      message:
        err.message || "Error retrieving Hotels.",
    });
    throw err;
  }
  const id = req.params.id;
  Hotel.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Hotel was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Hotel with id=${id}. Maybe Hotel was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Hotel with id=" + id,
      });
    });
};
// Delete a Hotel with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Hotel.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Hotel was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Hotel with id=${id}. Maybe Hotel was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Hotel with id=" + id,
      });
    });
};
// Delete all Hotels from the database.
exports.deleteAll = (req, res) => {
  Hotel.destroy({
    where: {},
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} Hotels were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Hotels.",
      });
    });
};
