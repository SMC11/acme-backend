const { saltSize, keySize } = require("../authentication/crypto");

module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customer", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    instructions: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Customer;
};
