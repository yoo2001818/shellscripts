// This is client's schema: used internally by frontend. If you're looking for
// server's DB schema, you should look /db/index.js instead.

import { Schema } from 'normalizr';

// Currently there is only a user schema, but others would be added soon.
export const User = new Schema('users', {
  idAttribute: 'login'
});
