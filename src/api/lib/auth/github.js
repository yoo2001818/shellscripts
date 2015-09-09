import { collections } from '../../../db/index.js';

export default function login(accessToken, refreshToken, profile, done) {
  const { User, Passport } = collections;
  const { displayName } = profile;
  const profileId = profile.id; // Strangely, id is a string.
  console.log(profile);
  // Retrieve passport with the identifier
  Passport.findOne({
    identifier: profileId,
    type: 'github'
  })
  .then(passport => {
    if (!passport) {
      // Register a new user and a passport.
      return User.create({
        username: displayName // TODO maybe not this?
      })
      .then(user => {
        return Passport.create({
          user: user.id,
          type: 'github',
          identifier: profileId,
          data: { accessToken, refreshToken }
        })
        .then((newPassport) => new Promise((resolve) => {
          // Inject passport list
          user.passports = [newPassport];
          const preToObject = user.toObject;
          user.toObject = function() {
            let self = preToObject.call(this);
            self.passports = this.passports;
            delete self.toObject;
            return self;
          };
          resolve(user);
        }));
      });
    } else {
      // Sign in using the passport.
      return User.findOne(passport.user)
      .populate('passports');
    }
  })
  .then(user => done(null, user), err => done(err));
}
