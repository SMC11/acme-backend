module.exports = (sequelize, Sequelize) => {
  const Map = sequelize.define("map", {
    fromNode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    toNode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Map;
};

