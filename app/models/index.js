const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.map = require("./map.model.js")(sequelize, Sequelize);
db.order = require("./order.model.js")(sequelize, Sequelize);
db.customer = require("./customer.model.js")(sequelize, Sequelize);
db.session = require("./session.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);

// foreign key for session
db.user.hasMany(
  db.session,
  { as: "session" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.session.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);



//foreign key for order
db.order.belongsTo(
  db.user,
  { as: "user"},
  { foreignKey: { allowNull: true }, onDelete: "SET NULL"}
);
db.order.belongsTo(
  db.customer,
  { as: 'customer' },
  { foreignKey: { allowNull: true }, onDelete: "SET NULL"}
)
db.order.belongsTo(
  db.customer,
  { as: 'deliverToCustomer' },
  { foreignKey: { allowNull: true }, onDelete: "SET NULL"}
)

module.exports = db;
