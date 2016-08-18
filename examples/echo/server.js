import Server from '../../src/server';

export default class EchoServer extends Server {
  constructor(...params) {
    super(...params);

    this.on('connect', (socket) => {
      socket.on('echo', (...params2) => this.onEcho(socket, ...params2));
    });
  }

  onEcho(socket, { text }) {
    if (typeof text !== 'string') return;

    socket.emit('echo', { text });
  }
}
