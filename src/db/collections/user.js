import Sequelize from 'sequelize';
import sequelize from '../init.js';
import Passport from './passport.js';

const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  signedUp: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

User.hasMany(Passport, {as: 'Passports'});

export default User;
