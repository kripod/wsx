import Client from '../../src/client';

export default class EchoClient extends Client {
  texts = [];

  constructor(...params) {
    super(...params);

    this.on('echo', this.onEcho);
  }

  onEcho({ text }) {
    this.texts.push(text);
  }

  echo(text) {
    this.emit('echo', { text });
  }
}
