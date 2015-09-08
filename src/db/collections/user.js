import { Collection } from 'waterline';

export default Collection.extend({
  identity: 'user',
  connection: 'default',
  attributes: {
    username: {
      type: 'string',
      unique: true,
      required: true
    },
    email: {
      type: 'string',
      email: true
    },
    passports: {
      collection: 'passport',
      via: 'user'
    },
    // Login via oAuth may prompt to the user
    signedUp: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    }
  }
});
