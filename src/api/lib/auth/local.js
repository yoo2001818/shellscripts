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
    return User.findOne(passport.id);
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
