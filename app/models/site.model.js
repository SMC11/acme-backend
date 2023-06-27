module.exports = (sequelize, Sequelize) => {
  const Site = sequelize.define("site", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING(2048),
      allowNull: false,
    },
    duration: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING(2048),
      allowNull: false,
    },
    link: {
      type: Sequelize.STRING(2048),
      allowNull: false,
    },
    photo: {
      type: Sequelize.STRING(2048),
      allowNull: false,
    },
  });
  return Site;
};
