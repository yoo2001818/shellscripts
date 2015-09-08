import { Collection } from 'waterline';

export default Collection.extend({
  identity: 'passport',
  connection: 'default',
  attributes: {
    user: {
      model: 'user',
      required: true
    },
    type: {
      type: 'string',
      required: true
    },
    identifier: {
      type: 'string',
      required: true
    },
    data: 'json',
    toJSON: function() {
      const obj = this.toObject();
      delete obj.data;
      delete obj.identifier;
      return obj;
    }
  }
});
