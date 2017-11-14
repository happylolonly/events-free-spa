import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

export default (req, store, context) => {
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path} context={context}>
      </StaticRouter>
    </Provider>
  );

  const testFolder = '../../build/';
  const fs = require('fs');

  fs.readdirSync(testFolder).forEach(file => {
    console.log(file);
  });


  return `
    <html>
      <head>
      </head>
      <body>
        <div id="root">${content}</div>
        <script src="bundle.js"></script>
      </body>
    </html>
  `;
};
