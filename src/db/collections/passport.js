import Sequelize from 'sequelize';
import sequelize from '../init.js';
// import User from './user.js';

const Passport = sequelize.define('passport', {
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: 'typeIdentifier'
  },
  identifier: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: 'typeIdentifier'
  },
  data: Sequelize.TEXT
});

export default Passport;
