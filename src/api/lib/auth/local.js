import { User, Passport, sequelize } from '../../../db/index.js';
import bcrypt from 'bcryptjs';

export function generatePassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      resolve(hash);
    });
  });
}

export function validatePassword(passport, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passport.data, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

export default function login(req, username, password, done) {
  let passport;
  // Retrieve passport with the username
  Passport.findOne({
    where: {
      identifier: username.toLowerCase(),
      type: 'local'
    }
  })
  .then(gotPassport => {
    passport = gotPassport;
    if (passport == null) {
      throw {
        id: 'AUTH_INVALID_USERNAME',
        message: 'Invalid username.',
        invalid: true
      };
    }
    // Validate password
    return validatePassword(passport, password);
  })
  .then(isValid => {
    if (!isValid) {
      throw {
        id: 'AUTH_INVALID_PASSWORD',
        message: 'Invalid password.',
        invalid: true
      };
    }
    return passport.getUser();
  })
  .then(user => {
    if (user == null || !user.enabled) {
      done(null, false, {
        id: 'AUTH_DISABLED_USER',
        message: 'User has been disabled. Please contact the administrator.'
      });
      return;
    }
    done(null, user);
  }, error => {
    if (error.invalid === true) {
      done(null, false, {
        id: error.id,
        message: error.message
      });
    } else {
      done(error);
    }
  });
}

export function register(req, credentials, done) {
  const { username, password, email } = credentials;
  if (username == null || password == null || email == null) {
    done({
      id: 'AUTH_MISSING_CREDENTIALS',
      message: 'Missing credentials',
      code: 400
    });
    return;
  }
  // TODO check if password / email matches
  sequelize.transaction(transaction =>
    // Retrieve passport with the username
    Passport.findOne({
      where: {
        identifier: username.toLowerCase(),
        type: 'local'
      }
    })
    .then(passport => {
      if (!req.user) {
        if (!passport) {
          // Register a new user and a passport.
          // TODO Check if email conflicts
          return User.create({
            username,
            email,
            // Local users have all the information when they sign up,
            // so we don't need additional stages
            signedUp: true
          }, {
            transaction
          })
          .then(user => {
            return generatePassword(password)
            .then(hash => Passport.create({
              userId: user.id,
              type: 'local',
              identifier: username.toLowerCase(),
              data: hash
            }, {
              transaction
            }))
            .then(() => new Promise((resolve, reject) => {
              req.login(user, err => {
                if (err) return reject(err);
                resolve();
              });
            }));
          });
        } else {
          // Sign in using the passport.
          // Of course, in local strategy, nobody would sign in with register
          // method. (And it's dangerous if we don't check password)
          throw {
            id: 'AUTH_USERNAME_EXISTS',
            message: 'Username is already in use.',
            code: 409
          };
          /*
          return User.findOne(passport.user)
          .populate('passports')
          .then(user => new Promise((resolve, reject) => {
            req.login(user, err => {
              if (err) return reject(err);
              resolve();
            });
          }));*/
        }
      } else {
        // Username MUST equal to user's username, or it'd do nothing.
        if (username !== req.user.username) {
          throw {
            id: 'AUTH_USERNAME_DIFFERENT',
            message: 'Username should be same as current user.',
            code: 400
          };
        }
        if (!passport) {
          // Create a passport and link it to the user.
          return generatePassword(password)
          .then(hash => Passport.create({
            userId: req.user.id,
            type: 'local',
            identifier: username.toLowerCase(),
            data: hash
          }, {
            transaction
          }))
          .then(newPassport => {
            // Inject new passport
            return newPassport;
          });
        } else {
          // Do nothing.
          // Since username should be equal to user's username, user only can
          // create one passport.
          throw {
            id: 'AUTH_METHOD_ALREADY_EXISTS',
            message: 'You already have this authentication method. You\'ll ' +
              'need to unregister current method in order to register new one.',
            code: 403
          };
        }
      }
    })
  )
  .then(() => done(), err => done(err));
}

export function changePassword(req, body, done) {
  const { oldPassword, password } = body;
  const { user } = req;
  // Get passport of the user
  user.getPassports({
    where: {
      type: 'local'
    }
  })
  .then(passports => {
    if (passports.length <= 0) {
      throw {
        id: 'AUTH_METHOD_NOT_FOUND',
        message: 'Specified authentication method is not found.',
        code: 404
      };
    }
    const passport = passports[0];
    // Validate password first
    return validatePassword(passport, oldPassword)
    .then(isValid => {
      if (!isValid) {
        throw {
          id: 'AUTH_INVALID_PASSWORD',
          message: 'Invalid password.',
          code: 401
        };
      }
    })
    .then(() => generatePassword(password))
    .then(hash => {
      passport.data = hash;
      return passport.save();
    });
  })
  .then(() => done(), err => done(err));
}
