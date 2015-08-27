// Just a dummy client. really.
export default function dummyClient(endpoint, options) {
  // Return a resolved Promise
  console.log('DummyClient: ', endpoint, options);
  return Promise.resolve(options);
}
