// Client init point

import React from 'react';
import App from './ui/app.js';

// Well, 'stores' and 'events' should be passed to the app.
// Server side rendering is synchronous, so we'd need react-async to use
// events, fetching with React.
// Reflux is not server-side rendering friendly due to global scope and stuff,
// So I think I'll find something else.

React.render(
  <App />,
  document.body
);
