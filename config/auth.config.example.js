export const github = {
  clientID: '###',
  clientSecret: '###',
  callbackURL: 'http://localhost:8000/api/session/github'
};

export const facebook = {
  clientID: '###',
  clientSecret: '###',
  callbackURL: 'http://localhost:8000/api/session/facebook',
  scope: ['email'],
  profileFields: ['id', 'emails', 'photos', 'displayName', 'name']
};
