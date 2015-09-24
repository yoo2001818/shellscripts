import { User, Passport, sequelize } from '../../../db/index.js';

export default function login(type, accessToken, refreshToken, profile, done) {
  const profileId = profile.id; // Strangely, id is a string.
  console.log(profile);
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
      // TODO registering auth method to current user
      if (!passport) {
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
          .then(() => new Promise((resolve) => {
            resolve(user);
          }));
        });
      } else {
        // Update passport access token
        passport.data = accessToken;
        return passport.save()
        // Sign in using the passport.
        .then(() => User.findById(passport.userId));
      }
    })
  )
  .then(user => done(null, user), err => done(err));
}
