import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { collections } from '../../db/index.js';

export default passport;

passport.use(new LocalStrategy(
  function(username, password, done) {
    const { user } = collections;
    console.log(user);
    return done('Not implemented yet');
  }
));
