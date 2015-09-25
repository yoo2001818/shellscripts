import Sequelize from 'sequelize';
import sequelize from './init.js';

export { sequelize };

export const Passport = sequelize.define('passport', {
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

export const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
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

export const TagType = sequelize.define('tagType', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  description: Sequelize.TEXT
});

export const Tag = sequelize.define('tag', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  description: Sequelize.TEXT
});

export const Script = sequelize.define('script', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  description: Sequelize.TEXT,
  script: Sequelize.TEXT
});

Passport.belongsTo(User);
User.hasMany(Passport);

TagType.hasMany(Tag);
Tag.belongsTo(User, {as: 'author'});
Tag.belongsTo(TagType, {as: 'type'});
Tag.belongsToMany(Script, {through: 'scriptTag'});

Script.belongsTo(User, {as: 'author'});
Script.belongsToMany(Tag, {through: 'scriptTag'});

sequelize.sync();
