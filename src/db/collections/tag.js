import Sequelize from 'sequelize';
import sequelize from '../init.js';
import User from './user.js';

const Tag = sequelize.define('tag', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  description: Sequelize.TEXT,
  type: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

Tag.belongsTo(User, {as: 'author'});

export default Tag;
