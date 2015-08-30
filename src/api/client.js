import xhr from 'xhr';

// Just a dummy client. really.
export function dummyClient(type, endpoint, options) {
  // Return a Promise that triggers after 1s
  console.log('DummyClient: ', type, endpoint, options);
  return new Promise((resolve) => {
    setTimeout(() => resolve(options), 0);
  });
}

// XMLRequest client
export function xhrClient(type, endpoint, options) {
  return new Promise((resolve, reject) => {
    xhr({
      json: options,
      url: endpoint,
      method: type
    }, (err, resp, body) => {
      if (err) return reject({err, body: err.toString()});
      let { statusCode } = resp;
      if (statusCode !== 200) {
        return reject({statusCode, body});
      }
      return resolve({statusCode, body});
    });
  });
}
