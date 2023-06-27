const db = require("../models");
const Itinerary = db.itinerary;
const ItineraryDay = db.itineraryDay;
const Subscription = db.subscription;
const ItineraryDayEvent = db.itineraryDayEvent;
const Site = db.site;
const Hotel = db.hotel;
const Op = db.Sequelize.Op;
// Create and Save a new ItineraryDay
exports.create = (req, res) => {
  console.log(req);
  // Validate request
  if (req.body.dayOfEvent === undefined) {
    const error = new Error("Day Of Event cannot be empty for ItineraryDay!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.hotel === undefined) {
    const error = new Error("Hotel cannot be empty for ItineraryDay!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.sites === undefined) {
    const error = new Error("Sites cannot be empty for ItineraryDay!");
    error.statusCode = 400;
    throw error;
  } 
   else if (req.body.itineraryId === undefined) {
    const error = new Error("Itinerary Id cannot be empty for ItineraryDay!");
    error.statusCode = 400;
    throw error;
  }

  // Create a ItineraryDay
  const itineraryDay = {
    dayOfEvent: req.body.dayOfEvent,
    hotelId: req.body.hotel.id,
    itineraryId: req.body.itineraryId,
  };

  // Save ItineraryDay in the database
  ItineraryDay.create(itineraryDay)
    .then((data) => {
      var itineraryDayEvents = [];
      var itineraryDayEvent = {};
      for(let i=0; i< req.body.sites.length; i++){
        itineraryDayEvent = {
            siteId: req.body.sites[i].id,
            itineraryDayId: data.dataValues.id,
        };
        itineraryDayEvents.push(itineraryDayEvent);
        ItineraryDayEvent.create(itineraryDayEvent)
        .catch((err) => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the ItineraryDayEvent.",
          });
        });
        }
        res.send(data);
      })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the ItineraryDay.",
      });
    });    

};



// Find all Itineraries
exports.findAll = (req, res) => {
  ItineraryDay.findAll({
    where:{itineraryId: req.params.itineraryId},
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
      },
      {
        model: Hotel,
        as: "hotel",
        required: false,
      }
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
          message: `Cannot find Itinerary Days`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error retrieving Itinerary Days",
      });
    });
};

// Find a single ItineraryDay with an id
exports.findOne = (req, res) => {
  const id = req.params.itineraryDayId;
  ItineraryDay.findAll({
    where: { id: id },
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
      },
      {
        model: Hotel,
        as: "hotel",
        required: false,
      }
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find ItineraryDay with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving ItineraryDay with id=" + id,
      });
    });
};
// Update a ItineraryDay by the id in the request
exports.update = (req, res) => {
  const id = req.params.itineraryDayId;
  ItineraryDay.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
        ItineraryDayEvent.destroy({
            where: {itineraryDayId: id}
        }).then((number) => {
            var itineraryDayEvents = [];
            var itineraryDayEvent = {};
            for(let i=0; i< req.body.sites.length; i++){
                itineraryDayEvent = {
                    siteId: req.body.sites[i].id,
                    itineraryDayId: id,
                };
                itineraryDayEvents.push(itineraryDayEvent);
                ItineraryDayEvent.create(itineraryDayEvent)
                .catch((err) => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while creating the ItineraryDayEvents.",
                });
                });
            }
        });
      if (number == 1) {
        res.send({
          message: "ItineraryDay was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update ItineraryDay with id=${id}. Maybe ItineraryDay was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating ItineraryDay with id=" + id,
      });
    });
};
// Delete a ItineraryDay with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.itineraryDayId;
  ItineraryDay.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "ItineraryDay was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete ItineraryDay with id=${id}. Maybe ItineraryDay was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete ItineraryDay with id=" + id,
      });
    });
};
// Delete all Days for Itinerary from the database.
exports.deleteAll = (req, res) => {
  ItineraryDay.destroy({
    where: {itineraryId: req.params.itineraryId},
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} Itinerary Days were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Days in Itinerary.",
      });
    });
};
