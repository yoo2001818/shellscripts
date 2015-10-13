export const github = {
  clientID: '###',
  clientSecret: '###',
  callbackURL: 'http://localhost:8000/api/session/github',
  passReqToCallback: true
};

export const facebook = {
  clientID: '###',
  clientSecret: '###',
  callbackURL: 'http://localhost:8000/api/session/facebook',
  scope: ['email'],
  profileFields: ['id', 'emails', 'photos', 'displayName', 'name'],
  passReqToCallback: true
};

export const local = {
  passReqToCallback: true
};
