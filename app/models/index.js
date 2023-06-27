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

db.itinerary = require("./itinerary.model.js")(sequelize, Sequelize);
db.itineraryDay = require("./itineraryDay.model.js")(sequelize, Sequelize);
db.itineraryDayEvent = require("./itineraryDayEvent.model.js")(sequelize, Sequelize);
db.site = require("./site.model.js")(sequelize, Sequelize);
db.hotel = require("./hotel.model.js")(sequelize, Sequelize);
db.subscription = require("./subscription.model.js")(sequelize, Sequelize);
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

// foreign keys for itinerary
db.user.hasMany(
  db.itinerary,
  { as: "itinerary"},
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.itinerary.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: true }, onDelete: "CASCADE" }
);

//foreign key for itineraryDay
db.itinerary.hasMany(
  db.itineraryDay,
  { as: "itineraryDay"},
  { foreignKey: { allowNull: false }, onDelete: "CASCADE"}
);
db.itineraryDay.belongsTo(
  db.itinerary,
  { as: "itinerary" },
  { foreignKey: {allowNull: false }, onDelete: "CASCADE"}
);

//foreign key for hotel
db.hotel.hasOne(
  db.itineraryDay,
  { as: "hotel"},
  { foreignKey: { allowNull: true }, onDelete: "SET NULL"}
);
db.itineraryDay.belongsTo(
  db.hotel,
  { as: "hotel"},
  { foreignKey: { allowNull: true }, onDelete: "SET NULL"}
);

//foreign key for itineraryDayEvent
db.itineraryDay.hasMany(
  db.itineraryDayEvent,
  { as: "itineraryDayEvent"},
  { foreignKey: { allowNull: false }, onDelete: "CASCADE"}
);
db.itineraryDayEvent.belongsTo(
  db.itineraryDay,
  { as: "itineraryDay" },
  { foreignKey: {allowNull: false }, onDelete: "CASCADE"}
);
db.itineraryDayEvent.belongsTo(
  db.site,
  { as: "site" },
  { foreignKey: {allowNull: false }, onDelete: "CASCADE"}
);

//foreign key for site
db.site.hasOne(
  db.itineraryDayEvent,
  { as: "site"},
  { foreignKey: { allowNull: true }, onDelete: "SET NULL"}
);

//foreign key for subscription
db.user.hasMany(
  db.subscription,
  { as: "subscription"},
  { foreignKey: { allowNull: false }, onDelete: "CASCADE"}
);
db.subscription.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: {allowNull: false }, onDelete: "CASCADE"}
);
db.itinerary.hasMany(
  db.subscription,
  { as: "subscription"},
  { foreignKey: { allowNull: false }, onDelete: "CASCADE"}
);
db.subscription.belongsTo(
  db.itinerary,
  { as: "itinerary" },
  { foreignKey: {allowNull: false }, onDelete: "CASCADE"}
);

module.exports = db;
