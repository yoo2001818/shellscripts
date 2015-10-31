import { User, Passport, sequelize } from '../../../db/index.js';

export default function login(type, req, accessToken, refreshToken, profile,
  done
) {
  const profileId = profile.id; // Strangely, id is a string.
  let email = null;
  if (profile.emails && profile.emails[0]) email = profile.emails[0].value;
  sequelize.transaction(transaction =>
    // Retrieve passport with the identifier
    Passport.findOne({
      where: {
        identifier: profileId,
        type
      }
    })
    .then(passport => {
      if (!passport) {
        if (req.user) {
          // Register a passport pointing the current user.
          return Passport.create({
            userId: req.user.id,
            type,
            identifier: profileId,
            // refreshToken is useless.
            data: accessToken
          }, {
            transaction
          })
          .then(() => req.user);
        } else {
          // Register a new user and a passport.
          return User.create({
            email
          }, {
            transaction
          })
          .then(user => {
            return Passport.create({
              userId: user.id,
              type,
              identifier: profileId,
              // refreshToken is useless.
              data: accessToken
            }, {
              transaction
            })
            .then(() => user);
          });
        }
      } else {
        if (req.user) {
          // Nopeeee
          throw {
            id: 'AUTH_METHOD_ALREADY_EXISTS',
            message: 'You already have this authentication method. You\'ll ' +
              'need to unregister current method in order to register new one.',
            invalid: true
          };
        } else {
          // Update passport access token
          passport.data = accessToken;
          return passport.save()
          // Sign in using the passport.
          .then(() => passport.getUser());
        }
      }
    })
  )
  .then(user => {
    if (user.enabled) {
      done(null, user);
    } else {
      done(null, false, {
        id: 'AUTH_DISABLED_USER',
        message: 'User has been disabled. Please contact the administrator.'
      });
    }
  }, err => {
    console.log(err.stack);
    done(err);
  });
}
