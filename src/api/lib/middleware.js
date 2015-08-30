import morgan from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';

export default function registerMiddlewares(app) {
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(session({
    secret: 'secret jfawjidijawifjawidjwaieawdjanca',
    resave: false,
    saveUninitialized: true
  }));
}
