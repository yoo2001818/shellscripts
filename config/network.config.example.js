// Note: This setting WILL be exposed to the clients; Don't write any
// sensitive information in this file!
module.exports = {
  // Do not place / at the end
  url: 'http://localhost:8000',
  port: 8000,
  hostname: '127.0.0.1',
  // Below setting will be ignored from the client if not reverse-proxying.
  useReverseProxy: true,
  // Note: API server can be reverse-proxied by the frontend server;
  // It's okay to use 'localhost' if reverse-proxying.
  // Note: The server doesn't allow CORS by default; not using reverse proxy
  // can cause some problems
  // Do not place / at the end
  apiUrl: 'http://localhost:8001',
  apiPort: 8001,
  apiHostname: '127.0.0.1',
  // Whether if the API server should run on different process
  // This will be ignored on the development server (this greatly increases
  // the starting up time)
  apiFork: true
};
