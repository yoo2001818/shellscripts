import superagent from 'superagent';
import netConfig from '../../config/network.config.js';

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
    return netConfig.apiUrl + url;
  }
  if (netConfig.useReverseProxy) {
    return '/api' + url;
  }
  return netConfig.apiUrl + url;
}

// superagent client
export function superagentClient(req) {
  return (type, endpoint, options = {}) => {
    return new Promise((resolve, reject) => {
      const request = superagent(type, wrapURL(endpoint));
      if (options.files) {
        for (let key in options.files) {
          request.attach(key, options.files[key]);
        }
        for (let key in options.body) {
          request.field(key, options.body[key]);
        }
      } else {
        if (options.body) {
          request.send(options.body);
        }
      }
      request.query(options.query);
      if (__SERVER__) {
        if (req.get('cookie')) request.set('cookie', req.get('cookie'));
        request.query({server: 'true'});
      }
      request.end((err, res) => {
        if (err) {
          if (res) {
            const { status, text } = res;
            let body = text;
            try {
              body = JSON.parse(text);
            } catch (e) {
              // Do nothing
            }
            return reject({
              status, body, error: err.toString()
            });
          } else {
            if (err.message ===
              'Origin is not allowed by Access-Control-Allow-Origin'
            ) {
              // No, it's not a CORS error.
              err.message =
                'Cannot establish connection to the server';
            }
            // Network error!
            return reject({
              status: -100, body: err.message, error: err.toString()
            });
          }
        }
        const { status, body } = res;
        return resolve({
          status, body
        });
      });
    }); // Client lag simulation
    /*.then(values => new Promise((resolve) => {
      if (__SERVER__) return resolve(values);
      setTimeout(() => resolve(values), 200);
    }))
    .catch(values => new Promise((resolve, reject) => {
      if (__SERVER__) return reject(values);
      setTimeout(() => reject(values), 200);
    }));*/
  };
}
