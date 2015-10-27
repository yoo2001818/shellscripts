// import merge from 'lodash/object/merge';

export default function entities(state = {
  users: {},
  entries: {},
  tags: {},
  tagTypes: {},
  comments: {}
}, action) {
  if (action.payload && action.payload.entities) {
    const newState = Object.assign({}, state);
    for (let key in action.payload.entities) {
      const original = Object.assign({}, newState[key]);
      newState[key] = original;
      const target = action.payload.entities[key];
      for (let entity in target) {
        if (target[entity] == null) {
          continue;
        }
        original[entity] = Object.assign({}, original[entity], target[entity], {
          loadedAt: new Date().valueOf()
        });
      }
    }
    return newState;
  }
  return state;
}
