/**
 * Represents a socket owned by a server or a client.
 * @class Socket
 */

/**
 * Represents a socket owned by a server.
 * @class ServerSideSocket
 * @extends Socket
 */

/**
 * Represents a map of socket extensions.
 * @class SocketExtensionMap
 */
export default class SocketExtensionMap extends Map {
  constructor() {
    super();

    /**
     * Transmits a message through the socket.
     * @name send
     * @memberof Socket
     * @param {string} type Type of the message.
     * @param {*} [payload] Payload of the message.
     */
    this.set('send', (socket, originalFn, parent) =>
      (type, payload) =>
        originalFn(
          parent.messageSerializer.serialize(parent.channel, type, payload)
        )
    );
  }

  /**
   * Applies the map of extensions on the given socket.
   * @param {Socket} socket Socket to apply extensions on.
   * @param {Server|Client} parent Parent of the given socket.
   * @returns {Socket}
   */
  apply(socket, parent) {
    for (const [key, value] of this) {
      const originalFn = socket[key] && socket[key].bind(socket);

      /* eslint-disable no-param-reassign */
      socket[key] = value(socket, originalFn, parent);
      /* eslint-enable no-param-reassign */
    }

    return socket;
  }
}
