import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github';
import localLogin from './auth/local.js';
import gitHubLogin from './auth/github.js';
import { collections } from '../../db/index.js';
import * as config from '../../../config/auth.config.js';

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
passport.use(new GitHubStrategy(config.github, gitHubLogin));
