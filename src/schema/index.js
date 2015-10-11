// This is client's schema: used internally by frontend. If you're looking for
// server's DB schema, you should look /db/index.js instead.

import { Schema, arrayOf } from 'normalizr';

export const User = new Schema('users', {
  idAttribute: 'login'
});

export const Entry = new Schema('entries', {
  idAttribute: entity => {
    console.log(entity);
    return entity.author.login + '/' + entity.name
  }
});

export const Tag = new Schema('tags', {
  idAttribute: 'name'
});

export const TagType = new Schema('tagTypes', {
  idAttribute: 'name'
});

User.define({
  entries: arrayOf(Entry)
});

Entry.define({
  author: User,
  tags: arrayOf(Tag)
})

Tag.define({
  author: User,
  type: TagType,
  entries: arrayOf(Entry)
});

TagType.define({
  tags: arrayOf(Tag)
});
