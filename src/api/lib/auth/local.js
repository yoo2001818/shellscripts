import { User, Passport, sequelize } from '../../../db/index.js';
import bcrypt from 'bcryptjs';

class PassportError extends Error {
}

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

export default function login(username, password, done) {
  let passport;
  // Retrieve passport with the username
  Passport.findOne({
    where: {
      identifier: username,
      type: 'local'
    }
  })
  .then(gotPassport => {
    passport = gotPassport;
    if (passport == null) throw new PassportError('Passport not found');
    // Validate password
    return validatePassword(passport, password);
  })
  .then(isValid => {
    if (!isValid) throw new PassportError('Password incorrect');
    return User.findById(passport.userId);
  })
  .then(user => {
    if (user == null) throw new PassportError('User not found');
    done(null, user);
  }, error => {
    if (error instanceof PassportError) {
      done(null, false, {
        message: error.message
      });
    } else {
      done(error);
    }
  });
}

export function register(req, credentials, done) {
  const { username, password } = credentials;
  sequelize.transaction(transaction =>
    // Retrieve passport with the username
    Passport.findOne({
      where: {
        identifier: username,
        type: 'local'
      }
    })
    .then(passport => {
      if (!req.user) {
        if (!passport) {
          // Register a new user and a passport.
          return User.create({
            username
          }, {
            transaction
          })
          .then(user => {
            return generatePassword(password)
            .then(hash => Passport.create({
              userId: user.id,
              type: 'local',
              identifier: username,
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
          throw new Error('Username already exists');
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
          throw new Error('Username not matches');
        }
        if (!passport) {
          // Create a passport and link it to the user.
          return generatePassword(password)
          .then(hash => Passport.create({
            userId: req.user.id,
            type: 'local',
            identifier: username,
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
          throw new Error('Already signed in');
        }
      }
    })
  )
  .then(() => done(), err => done(err));
}
