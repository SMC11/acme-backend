module.exports = (sequelize, Sequelize) => {
    const Map = sequelize.define("map", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      adjacentNodes: {
        type: Sequelize.STRING(2048),
        allowNull: false,
      },
    });
    return Map;
  };
  
