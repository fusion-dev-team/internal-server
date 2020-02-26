const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const config = require('../../config/index');

const db = {};

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  config.db
);

sequelize.authenticate()
  .then(() => {
    console.log('>>> \u001b[32mConnection has been established successfully of sequilize.\u001b[39m');
  })
  .catch((err) => {
    console.error('>>> \u001b[31mUnable to connect to the database of sequilize:\u001b[39m', err.message);
    process.exit(1);
  });

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
