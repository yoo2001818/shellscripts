import passport from 'passport';
import { User } from '../../db/index.js';
import strategy from './auth/strategy.js';

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

// Register all strategies
for (let key in strategy) {
  passport.use(strategy[key].strategy);
}
