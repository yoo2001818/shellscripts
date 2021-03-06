// This is client's schema: used internally by frontend. If you're looking for
// server's DB schema, you should look /db/index.js instead.

import { Schema, arrayOf } from 'normalizr';

export const User = new Schema('users', {
  idAttribute: entity => {
    if (entity.username) return entity.username.toLowerCase();
    return entity.id;
  }
});

export const Entry = new Schema('entries', {
  idAttribute: entity => {
    return entity.author.username.toLowerCase() + '/' + entity.name;
  }
});

export const Tag = new Schema('tags', {
  idAttribute: 'name'
});

export const TagType = new Schema('tagTypes', {
  idAttribute: 'name'
});

export const Comment = new Schema('comments', {
  idAttribute: 'id'
});

User.define({
  entries: arrayOf(Entry)
});

Entry.define({
  author: User,
  tags: arrayOf(Tag),
  children: arrayOf(Entry)
});

Tag.define({
  author: User,
  type: TagType,
  entries: arrayOf(Entry)
});

TagType.define({
  tags: arrayOf(Tag)
});

Comment.define({
  author: User
});
