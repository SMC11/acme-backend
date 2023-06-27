const db = require("../models");
const Site = db.site;
const Subscription = db.subscription;
const Op = db.Sequelize.Op;
// Create and Save a new Site
exports.create = (req, res) => {
  console.log(req);
  // Validate request
  if (req.body.name === undefined) {
    const error = new Error("Name cannot be empty for Site!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.description === undefined) {
    const error = new Error("Description cannot be empty for Site!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.duration === undefined) {
    const error = new Error("Duration cannot be empty for Site!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.address === undefined) {
    const error = new Error("Address cannot be empty for Site!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.link === undefined) {
    const error = new Error("Link cannot be empty for Site!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.photo === undefined) {
    const error = new Error("Photo cannot be empty for Site!");
    error.statusCode = 400;
    throw error;
  }

  // Create a Site
  const site = {
    name: req.body.name,
    address: req.body.address,
    description: req.body.description,
    duration: req.body.duration,
    link: req.body.link,
    photo: req.body.photo,
  };
  // Save Site in the database
  Site.create(site)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Site.",
      });
    });
};

// Find all Sites
exports.findAll = (req, res) => {
  Site.findAll({
    order: [
      ["name", "ASC"],
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find all Sites.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error retrieving Sites.",
      });
    });
};

// Find Site for ItineraryDayEvent
exports.findAllForItineraryDayEvent = (req, res) => {
  const itineraryDayEventId = req.params.itineraryDayEventId;

  Subscription.findAll({
    where: { itineraryDayEventId: itineraryDayEventId },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Site for ItineraryDayEvent.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Site for ItineraryDayEvent.",
      });
    });
};

// Find a single Site with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Site.findAll({
    where: { id: id },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Site with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Site with id=" + id,
      });
    });
};
// Update a Site by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Site.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Site was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Site with id=${id}. Maybe Site was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Site with id=" + id,
      });
    });
};
// Delete a Site with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Site.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Site was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Site with id=${id}. Maybe Site was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Site with id=" + id,
      });
    });
};
// Delete all Sites from the database.
exports.deleteAll = (req, res) => {
  Site.destroy({
    where: {},
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} Sites were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Sites.",
      });
    });
};
