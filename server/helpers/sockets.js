import parse from '../modules/parse';
import ssr from '../modules/ssr';


export default (io) => {

  const connections = [];

  io.sockets.on('connection', (socket) => {

    socket.once('disconnect', () => {
      console.log('disconnect');
      connections.splice(connections.indexOf(socket), 1);
      socket.disconnect();
      console.log('Connected: %s sockets connected.', connections.length);
    });

    socket.on('reparse events', () => {
      console.log('reparsing starts');
      ssr.init();
      // parse.start();
    });

    // socket.on('update', () => {
    //   console.log('reparsing starts');
    //   parse.start();
    // });

    connections.push(socket);
    console.log('Connected: %s sockets connected.', connections.length);

  });

};
