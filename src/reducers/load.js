import * as LoadActions from '../actions/load.js';

export default function load(state = {
  completed: 0, total: 0, loading: false
}, action) {
  const { type } = action;
  let { completed, total, loading } = state;
  switch (type) {
    case LoadActions.LOAD:
      total++;
      loading = true;
      return {
        completed, total, loading
      };
    case LoadActions.COMPLETE:
      completed++;
      if (completed >= total) {
        completed = 0;
        total = 0;
        loading = false;
      }
      return {
        completed, total, loading
      };
  }
  return state;
}
