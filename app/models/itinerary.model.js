module.exports = (sequelize, Sequelize) => {
    const Itinerary = sequelize.define("itinerary", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(2048),
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      durationType: {
        type: Sequelize.STRING(1),
        allowNull: false,
      },
      photo: {
        type: Sequelize.STRING(2048),
        allowNull: true,
      },
    });
    return Itinerary;
  };
  