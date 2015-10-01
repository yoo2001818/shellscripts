import * as UserActions from '../actions/user.js';

export default function user(state = {
  entities: {},
  // User ID by username. Used for quick indexing
  usernames: {}
}, action) {
  const { entities, usernames } = state;
  const { type, payload, error, meta } = action;
  const body = payload && payload.body;
  switch (type) {
  case UserActions.FETCH:
    if (error) {
      if (payload.status === 404) {
        return Object.assign({}, state, {
          // null and undefined is handled differently;
          // null is 'not found', undefined is 'pending'.
          usernames: Object.assign({}, usernames, {
            [meta.username.toLowerCase()]: null
          })
        });
      }
      return state;
    }
    console.log(body);
    return Object.assign({}, state, {
      entities: Object.assign({}, entities, {
        [body.id]: body
      }),
      usernames: Object.assign({}, usernames, {
        [body.username && body.username.toLowerCase()]: body.id
      })
    });
  }
  return state;
}
