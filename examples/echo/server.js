import Server from '../../src/server';

export default class EchoServer extends Server {
  constructor(...params) {
    super(...params);

    this.on('message:echo', this.onEcho);
  }

  onEcho(socket, { text }) {
    if (typeof text !== 'string') return;

    socket.send('echo', { text });
  }
}
