// Just a dummy client. really.
export default function dummyClient(type, endpoint, options) {
  // Return a Promise that triggers after 1s
  console.log('DummyClient: ', type, endpoint, options);
  return new Promise((resolve) => {
    setTimeout(() => resolve(options), 1000);
  });
}
