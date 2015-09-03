/**
 * Translates a Promise returning Router to a valid Router.
 * @param  {Promise} promise a Promise returns a Router.
 * @param  {Function} loadHandler A handler that handles request instead
 *                                when the router is not ready.
 * @return {Router} A router object.
 */
export default function routerThunk(promise, loadHandler = (req, res) => {
  res.status(500).send('Application not ready');
}) {
  let instance = null;
  if (typeof promise.then !== 'function') {
    throw new Error('Not a valid Promise');
  }
  promise.then(returned => instance = returned);
  return (req, res, next) => {
    if (instance) return instance(req, res, next);
    // Handle error
    loadHandler(req, res, next);
  };
}
