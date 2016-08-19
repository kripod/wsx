import { DISALLOWED_MESSAGE_TYPES } from './config';

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
     * Emits an event to the corresponding socket.
     * @name emit
     * @memberof Socket
     * @param {string} type Type of the event.
     * @param {...*} [params] Parameters of the event.
     */
    this.set('emit', (socket, originalFn, parent) =>
      (type, ...params) => {
        if (DISALLOWED_MESSAGE_TYPES.indexOf(type) < 0) {
          // TODO: Throw an exception
          return;
        }

        socket.send(parent.messageSerializer.serialize(type, ...params));
      }
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
