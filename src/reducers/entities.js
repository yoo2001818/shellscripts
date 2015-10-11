import merge from 'lodash/object/merge';

export default function entities(state = {
  users: {},
  entries: {},
  tags: {},
  tagTypes: {}
}, action) {
  if (action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }
  return state;
}
