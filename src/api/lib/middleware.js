import bodyParser from 'body-parser';
import session from 'express-session';
import passport from './passport.js';
import { sequelize } from '../../db/index.js';
import sequelizeStore from 'connect-session-sequelize';
const SequelizeStore = sequelizeStore(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
  table: 'session'
});

export default function registerMiddlewares(app) {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(session({
    secret: 'secret jfawjidijawifjawidjwaieawdjanca',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
  }));
  app.use(passport.initialize());
  app.use(passport.session());
}
