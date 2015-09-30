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
  login: {
    type: Sequelize.STRING,
    unique: true
  },
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
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  name: Sequelize.STRING,
  bio: Sequelize.TEXT,
  photo: Sequelize.STRING,
  website: {
    type: Sequelize.STRING,
    validate: {
      isURL: true
    }
  }
}, {
  hooks: {
    beforeValidate: (user, options) => {
      if (user.username) {
        user.login = user.username.toLowerCase();
      }
      // Sequelize requires to update 'fields' array if we want to update
      // the value. TODO I should report an issue.
      if (options.fields) {
        options.fields.push('login');
      }
    }
  },
  instanceMethods: {
    toJSON: function() {
      let obj = this.get({
        plain: true
      });
      delete obj.createdAt;
      delete obj.updatedAt;
      return obj;
    }
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
User.hasMany(Script);
// Uh... why do I need this?
User.hasMany(Tag);

TagType.hasMany(Tag);
Tag.belongsTo(User, {as: 'author'});
Tag.belongsTo(TagType, {as: 'type'});
Tag.belongsToMany(Script, {through: 'scriptTag'});

Script.belongsTo(User, {as: 'author'});
Script.belongsToMany(Tag, {through: 'scriptTag'});

sequelize.sync();
