module.exports = (sequelize, Sequelize) => {
    const Intersection = sequelize.define("intersection", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      adjacentNodes: {
        type: Sequelize.STRING(2048),
        allowNull: false,
      },
    });
    return Intersection;
  };
  
