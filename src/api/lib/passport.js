import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import localLogin from './auth/local.js';
import oAuthLogin from './auth/oauth.js';
import { User } from '../../db/index.js';
import * as config from '../../../config/auth.config.js';

export default passport;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
  .then(user => {
    done(null, user);
  });
});

passport.use(new LocalStrategy(localLogin));
passport.use(
  new GitHubStrategy(config.github, oAuthLogin.bind(null, 'github'))
);
passport.use(
  new FacebookStrategy(config.facebook, oAuthLogin.bind(null, 'facebook'))
);
