import User from './collections/user.js';
import Passport from './collections/passport.js';
import sequelize from './init.js';
export { User, Passport, sequelize };

sequelize.sync();
