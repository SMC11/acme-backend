const db = require("../models");
const User = db.user;
const Itinerary = db.itinerary;
const Subscription = db.subscription;
const ItineraryDay = db.itineraryDay;
const ItineraryDayEvent = db.itineraryDayEvent;
const Site = db.site;
const Hotel = db.hotel;
const Op = db.Sequelize.Op;
// Create and Save a new Itinerary
exports.create = (req, res) => {
  console.log(req);
  // Validate request
  if (req.body.name === undefined) {
    const error = new Error("Name cannot be empty for Itinerary!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.description === undefined) {
    const error = new Error("Description cannot be empty for Itinerary!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.duration === undefined) {
    const error = new Error("Duration cannot be empty for Itinerary!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.durationType === undefined) {
    const error = new Error("Duration Type cannot be empty for Itinerary!");
    error.statusCode = 400;
    throw error;
  } 
  // else if (req.body.photo === undefined) {
  //   const error = new Error("Photo cannot be empty for Itinerary!");
  //   error.statusCode = 400;
  //   throw error;
  // }
   else if (req.body.userId === undefined) {
    const error = new Error("User Id cannot be empty for Itinerary!");
    error.statusCode = 400;
    throw error;
  }

  // Create a Itinerary
  const itinerary = {
    name: req.body.name,
    description: req.body.description,
    duration: req.body.duration,
    durationType: req.body.durationType,
    photo: req.body.photo,
    userId: req.body.userId,
  };
  // Save Itinerary in the database
  Itinerary.create(itinerary)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Itinerary.",
      });
    });
};

// Find all Itineraries
exports.findAll = (req, res) => {
  Itinerary.findAll({
    include: [
      {
        model: ItineraryDay,
        as: "itineraryDay",
        required: false,
        include: [
          {
            model: ItineraryDayEvent,
            as: "itineraryDayEvent",
            required: false,
            include: [
              {
                model: Site,
                as: "site",
                required: false,
              }
            ],
          }
        ],
      },
    ],
    order: [
      ["name", "ASC"],
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Itineraries`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error retrieving Itineraries",
      });
    });
};

// Find all Subscribed Itineraries
exports.findAllSubscribed = (req, res) => {
  const userId = req.params.userId;

  Subscription.findAll({
    where: { userId: userId },
    include: [
      {
        model: Itinerary,
        as: "itinerary",
        required: false,
        include: [
      {
        model: ItineraryDay,
        as: "itineraryDay",
        required: false,
        include: [
          {
            model: ItineraryDayEvent,
            as: "itineraryDayEvent",
            required: false,
            include: [
              {
                model: Site,
                as: "site",
                required: false,
              }
            ],
          }
        ],
      },
    ],
    },
  ],
    order: [
      ["updatedAt", "DESC"],
    ],
  })
    .then((data) => {
      if (data) {
        data = data.map(subscription => subscription.itinerary);
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Subscribed Itineraries.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Subscribed Itineraries.",
      });
    });
};

// Find a single Itinerary with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Itinerary.findAll({
    where: { id: id },
    include: [
      {
        model: ItineraryDay,
        as: "itineraryDay",
        required: false,
        include: [
          {
            model: Hotel,
            as: "hotel",
            required: false,
          },
          {
            model: ItineraryDayEvent,
            as: "itineraryDayEvent",
            required: false,
            include: [
              {
                model: Site,
                as: "site",
                required: false,
              }
            ],
          }
        ],
      },
      {
        model: Subscription,
        as: "subscription",
        required: false,
        include: [
          {
            model: User,
            as: "user",
            required: false,
          }
        ]
      }
    ],
    order: [
      [db.Sequelize.col("itineraryDay.dayOfEvent"), "ASC"],
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Itinerary with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Itinerary with id=" + id,
      });
    });
};
// Update a Itinerary by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Itinerary.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Itinerary was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Itinerary with id=${id}. Maybe Itinerary was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Itinerary with id=" + id,
      });
    });
};
// Delete a Itinerary with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Itinerary.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Itinerary was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Itinerary with id=${id}. Maybe Itinerary was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Itinerary with id=" + id,
      });
    });
};
// Delete all Itineraries from the database.
exports.deleteAll = (req, res) => {
  Itinerary.destroy({
    where: {},
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} Itineraries were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Itineraries.",
      });
    });
};
