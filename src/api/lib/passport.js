import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { collections } from '../../db/index.js';

export default passport;

passport.use(new LocalStrategy(
  function(username, password, done) {
    const { User } = collections;
    console.log(User);
    return done('Not implemented yet');
  }
));
