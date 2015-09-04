import { Collection } from 'waterline';

export default Collection.extend({
  identity: 'user',
  connection: 'default',
  attributes: {
    username: {
      type: 'string',
      unique: true
    }
  }
});
