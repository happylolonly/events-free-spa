import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import Routes from '../../client/src/Routes';

export default (req, store, context) => {
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path} context={context}>
        <div>{renderRoutes(Routes)}</div>
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


  // res.sendFile(__dirname + '/build');

    // const content = renderer(req, store);
    // res.send(content);

  // const store = createStore(req);

  // const promises = matchRoutes(Routes, req.path)
  //   .map(({ route }) => {
  //     return route.loadData ? route.loadData(store) : null;
  //   });
    // .map(promise => {
    //   if (promise) {
    //     return new Promise((resolve, reject) => {
    //       promise.then(resolve).catch(resolve);
    //     });
    //   }
    // });

  // Promise.all(promises).then(() => {
  //   const context = {};
  //   const content = renderer(req, store, context);

    // if (context.url) {
    //   return res.redirect(301, context.url);
    // }
    // if (context.notFound) {
    //   res.status(404);
    // }

//     res.send(content);
//   });



// import renderer from './helpers/renderer';
// import createStore from './helpers/createStore';
// // import Routes from '../client/src/routes';
// import { matchRoutes } from 'react-router-config';
