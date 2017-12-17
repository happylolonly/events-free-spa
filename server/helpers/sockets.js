import parse from './parse';

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
      parse(io);
    });

    connections.push(socket);
    console.log('Connected: %s sockets connected.', connections.length);

  });

};
