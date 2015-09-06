import { collections } from '../../db/index.js';

export function validatePassword(passport, password) {
  // TODO: use bcrypt
  return Promise.resolve(true);
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
