import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import localLogin from './auth/local.js';

export default passport;

passport.use(new LocalStrategy(localLogin));
