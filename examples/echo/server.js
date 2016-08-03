import Server from '../../src/server';

export default class EchoServer extends Server {
  constructor(...params) {
    super(...params);

    this.on('message:echo', this.onEcho);
  }

  onEcho(client, { text }) {
    if (typeof text !== 'string') return;

    client.send('echo', { text });
  }
}
