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
 * Represents a set of socket extensions.
 * @class SocketExtensionSet
 */
export default class SocketExtensionSet extends Set {
  /**
   * @param {*} [iterable] Elements to be initially added to the set.
   */
  constructor(iterable) {
    super(iterable);

    // Add default shared socket extensions
    this.add((socket) => {
      const sendRaw = socket.send.bind(socket);

      /**
       * Transmits a message through the socket.
       * @name send
       * @memberof Socket
       * @param {string} type Type of the message.
       * @param {*} [payload] Payload of the message.
       */
      return function send(type, payload) {
        sendRaw(socket.parent.messageSerializer.serialize(type, payload));
      };
    });
  }

  /**
   * Applies the set of extensions on the given socket.
   * @param {Socket} socket Socket to apply extensions on.
   * @param {Server|Client} parent Parent of the given socket.
   * @returns {Socket}
   */
  apply(socket, parent) {
    /* eslint-disable no-param-reassign */
    socket.parent = parent;

    for (const item of this) {
      const extensionFn = item(socket);
      socket[extensionFn.name] = extensionFn;
    }
    /* eslint-enable no-param-reassign */

    return socket;
  }
}
