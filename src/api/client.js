import superagent from 'superagent';

// Just a dummy client. really.
export function dummyClient(type, endpoint, options) {
  // Return a Promise that triggers after 1s
  console.log('DummyClient: ', type, endpoint, options);
  return new Promise((resolve) => {
    setTimeout(() => resolve(options), 0);
  });
}

function wrapURL(url) {
  if (__SERVER__) {
    return 'http://localhost:8000' + url;
  }
  return url;
}

// superagent client
export function superagentClient(req) {
  return (type, endpoint, options) => {
    return new Promise((resolve, reject) => {
      const request = superagent(type, wrapURL(endpoint));
      request.send(options);
      if (__SERVER__) {
        if (req.get('cookie')) request.set('cookie', req.get('cookie'));
      }
      request.end((err, res) => {
        if (err) {
          const { status, text } = res;
          return reject({
            status, body: text, err: err.toString()
          });
        }
        const { status, body } = res;
        return resolve({
          status, body
        });
      });
    });
  };
}
