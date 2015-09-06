import { collections } from '../../db/index.js';
import bcrypt from 'bcrypt';
// Fallback to bcryptjs if not available
if (bcrypt == null) {
  bcrypt = require('bcryptjs');
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
    if (passport == null) throw new Error('Passport not found');
    // Validate password
    return validatePassword(passport, password);
  })
  .then(isValid => {
    if (!isValid) throw new Error('Password incorrect');
    return User.findOne(passport.id);
  })
  .then(user => {
    if (user == null) throw new Error('User not found');
    done(null, user);
  }, error => {
    done(error);
  });
}
