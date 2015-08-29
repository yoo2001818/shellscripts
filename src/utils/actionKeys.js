export default function actionKeys(actions) {
  if (actions == null) return [];
  return Object.keys(actions)
    .filter(key => typeof (actions[key]) === 'string')
    .map(key => actions[key]);
}
