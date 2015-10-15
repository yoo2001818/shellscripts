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
    unique: true,
    validate: {
      is: /^[a-z0-9]+$/
    }
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      is: /^[a-zA-Z0-9]+$/,
      len: [1, 32]
    }
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
  name: {
    type: Sequelize.STRING,
    validate: {
      len: [0, 64]
    }
  },
  bio: {
    type: Sequelize.TEXT,
    validate: {
      // I think 280 characters are enough.
      len: [0, 280]
    }
  },
  photo: Sequelize.STRING,
  website: {
    type: Sequelize.STRING,
    validate: {
      isURL: true,
      // Don't think this is necessary though
      len: [0, 256]
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
      delete obj.passports;
      delete obj.updatedAt;
      return obj;
    }
  }
});

export const TagType = sequelize.define('tagType', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^([a-z0-9][a-z0-9\-]+[a-z0-9]|[a-z0-9]+)$/,
      len: [1, 32]
    }
  },
  description: Sequelize.TEXT
}, {
  hooks: {
    beforeValidate: entry => {
      if (entry.name) {
        entry.name = entry.name.toLowerCase();
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

export const Tag = sequelize.define('tag', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^([a-z0-9][a-z0-9\-]+[a-z0-9]|[a-z0-9]+)$/,
      len: [1, 32]
    }
  },
  description: Sequelize.TEXT
}, {
  hooks: {
    beforeValidate: entry => {
      if (entry.name) {
        entry.name = entry.name.toLowerCase();
      }
    }
  },
  instanceMethods: {
    toJSON: function() {
      let obj = this.get({
        plain: true
      });
      delete obj.createdAt;
      return obj;
    }
  }
});

export const Entry = sequelize.define('entry', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      is: /^([a-z0-9][a-z0-9\-]+[a-z0-9]|[a-z0-9]+)$/,
      len: [1, 48]
    }
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [0, 150]
    }
  },
  brief: {
    type: Sequelize.TEXT,
    validate: {
      len: [0, 400]
    }
  },
  description: Sequelize.TEXT,
  type: {
    type: Sequelize.ENUM('script', 'collection'),
    allowNull: false
  },
  script: Sequelize.TEXT,
  requiresRoot: Sequelize.BOOLEAN
}, {
  hooks: {
    beforeValidate: entry => {
      if (entry.name) {
        entry.name = entry.name.toLowerCase();
      }
    }
  },
  instanceMethods: {
    toJSON: function() {
      let obj = this.get({
        plain: true
      });
      return obj;
    }
  }
});

Passport.belongsTo(User);
User.hasMany(Passport);
User.hasMany(Entry, {as: 'entries'});
// Uh... why do I need this?
User.hasMany(Tag, {as: 'tags'});

TagType.hasMany(Tag, {as: 'tags'});
Tag.belongsTo(User, {as: 'author'});
Tag.belongsTo(TagType, {as: 'type'});
Tag.belongsToMany(Entry, {through: 'entryTag', as: 'entries'});

Entry.belongsTo(User, {as: 'author'});
Entry.belongsToMany(Tag, {through: 'entryTag', as: 'tags'});

sequelize.sync();
