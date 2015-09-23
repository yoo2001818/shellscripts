import User from './collections/user.js';
import Passport from './collections/passport.js';
import Tag from './collections/tag.js';
import sequelize from './init.js';
export { User, Passport, Tag, sequelize };

sequelize.sync();
