const db = require("../models");
const User = db.user;
const Subscription = db.subscription;
const Session = db.session;
const Op = db.Sequelize.Op;
const { encrypt, getSalt, hashPassword } = require("../authentication/crypto");

// Create and Save a new User
exports.create = async (req, res) => {
  // Validate request
  if (req.body.firstName === undefined) {
    const error = new Error("First name cannot be empty for user!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.lastName === undefined) {
    const error = new Error("Last name cannot be empty for user!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.phoneNumber === undefined) {
    const error = new Error("Phone Number cannot be empty for user!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.email === undefined) {
    const error = new Error("Email cannot be empty for user!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.password === undefined) {
    const error = new Error("Password cannot be empty for user!");
    error.statusCode = 400;
    throw error;
  }

  // find by email
  await User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then(async (data) => {
      if (data) {
        return "This email is already in use.";
      } else {
        console.log("email not found");

        let salt = await getSalt();
        let hash = await hashPassword(req.body.password, salt);

        // Create a User
        const user = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          password: hash,
          salt: salt,
          role: req.body.role,
        };

        // Save User in the database
        await User.create(user)
          .then(async (data) => {
            // Create a Session for the new user
            let userId = data.id;

            let expireTime = new Date();
            expireTime.setDate(expireTime.getDate() + 1);

            const session = {
              email: req.body.email,
              userId: userId,
              expirationDate: expireTime,
            };
            await Session.create(session).then(async (data) => {
              let sessionId = data.id;
              let token = await encrypt(sessionId);
              let userInfo = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                id: user.id,
                token: token,
              };
              res.send(userInfo);
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the User.",
            });
          });
      }
    })
    .catch((err) => {
      return err.message || "Error retrieving User with email=" + email;
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const id = req.params.id;
  var condition = id ? { id: { [Op.like]: `%${id}%` } } : null;

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Retrieve all Clerks from the database.
exports.findAllClerks = (req, res) => {
  var condition = { role: { [Op.eq]: 1 } };

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Retrieve all Drivers from the database.
exports.findAllDrivers = (req, res) => {
  var condition = { role: { [Op.eq]: 0 } };

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Retrieve all User Subscriptions from the database.
exports.findSubscriptions = (req, res) => {
  const id = req.params.id;
  // if (id === undefined || id <= 0) {
  //   res.status(400).send({
  //     message: "Id cannot be empty for user!",
  //   });
  //   return;
  // }
  var condition = id ? { userId: { [Op.like]: `%${id}%` } } : null;

  Subscription.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving user subscriptions.",
      });
    });
};
// Subscribe a user to an Itinerary
exports.subscribe = (req, res) => {
  const id = req.params.id;
  const itineraryId = req.params.itineraryId;
  const subscription = {
    userId: id,
    itineraryId: itineraryId,
  };
  Subscription.create(subscription)
  .then((data) => {
    res.send({ message: `Subscribed successfully!` });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while subscribing to itinerary.",
    });
  });
}

// Subscribe a user to an Itinerary
exports.unsubscribe = (req, res) => {
  const id = req.params.id;
  const itineraryId = req.params.itineraryId;
  Subscription.destroy({
    where: { userId: id, itineraryId: itineraryId },
  })
  .then((number) => {
    res.send({ message: `Unsubscribed successfully!` });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while subscribing to itinerary.",
    });
  });
}

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id = ${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving User with id = " + id,
      });
    });
};

// Find a single User with an email
exports.findByEmail = (req, res) => {
  const email = req.params.email;

  User.findOne({
    where: {
      email: email,
    },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send({ email: "not found" });
        /*res.status(404).send({
          message: `Cannot find User with email=${email}.`
        });*/
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving User with email=" + email,
      });
    });
};

// Update a User by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  let user = await User.findOne({id: id});
  if(typeof req.body.password == "string"){
    let salt = user.dataValues.salt;
    let hash = await hashPassword(req.body.password, salt);
    req.body.password = hash;
    req.body.salt = salt;
  }
  User.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id = ${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating User with id =" + id,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id = ${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete User with id = " + id,
      });
    });
};

// Delete all People from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} People were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all people.",
      });
    });
};
