module.exports = (sequelize, Sequelize) => {
    const ItineraryDay = sequelize.define("itineraryDay", {
      dayOfEvent: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    return ItineraryDay;
  };
  