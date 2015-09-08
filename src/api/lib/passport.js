import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import localLogin from './auth/local.js';
import { collections } from '../../db/index.js';

export default passport;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const { User } = collections;
  User.findOne(id)
  .populate('passports')
  .exec((err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy(localLogin));
