module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("order", {
    pickupTime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    finalBill: {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    },
    deliveryTime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    blocks: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    state: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    quotedPrice: {
      type: Sequelize.DECIMAL(10,2),
      allowNull: false,
    },
  });
  return Order;
};
