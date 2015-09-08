import { collections } from '../../../db/index.js';
import bcrypt from 'bcrypt';

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
  const { User, Passport } = collections;
  let passport;
  // Retrieve passport with the username
  Passport.findOne({
    identifier: username,
    type: 'local'
  })
  .then(gotPassport => {
    passport = gotPassport;
    if (passport == null) throw new PassportError('Passport not found');
    // Validate password
    return validatePassword(passport, password);
  })
  .then(isValid => {
    if (!isValid) throw new PassportError('Password incorrect');
    return User.findOne(passport.id)
      .populate('passports');
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
  const { User, Passport } = collections;
  const { username, password } = credentials;
  // Retrieve passport with the username
  Passport.findOne({
    identifier: username,
    type: 'local'
  })
  .then(passport => {
    if (!req.user) {
      if (!passport) {
        // Register a new user and a passport.
        return User.create({
          username
        })
        .then(user => {
          return generatePassword(password)
          .then(hash => Passport.create({
            user: user.id,
            type: 'local',
            identifier: username,
            data: hash
          }))
          .then((newPassport) => new Promise((resolve, reject) => {
            req.login(user, err => {
              // Inject passport list
              req.user.passports = [newPassport];
              const preToObject = req.user.toObject;
              req.user.toObject = function() {
                let self = preToObject.call(this);
                self.passports = this.passports;
                delete self.toObject;
                return self;
              };
              if (err) return reject(err);
              resolve();
            });
          }));
        });
      } else {
        // Sign in using the passport.
        return User.findOne(passport.user)
        .populate('passports')
        .then(user => new Promise((resolve, reject) => {
          req.login(user, err => {
            if (err) return reject(err);
            resolve();
          });
        }));
      }
    } else {
      if (!passport) {
        // Create a passport and link it to the user.
        return generatePassword(password)
        .then(hash => Passport.create({
          user: req.user.id,
          type: 'local',
          identifier: username,
          data: hash
        }))
        .then(newPassport => {
          // Inject new passport
          req.user.passports.push(newPassport);
          const preToObject = req.user.toObject;
          req.user.toObject = function() {
            let self = preToObject.call(this);
            self.passports = this.passports;
            delete self.toObject;
            return self;
          };
          return newPassport;
        });
      } else {
        // Do nothing.
      }
    }
  })
  .then(() => done(), err => done(err));
}
