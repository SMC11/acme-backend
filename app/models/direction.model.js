module.exports = (sequelize, Sequelize) => {
    const Direction = sequelize.define("direction", {
      start: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      end: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      directions: {
        type: Sequelize.STRING(2048),
        allowNull: false,
      },
    });
    return Direction;
  };
  
