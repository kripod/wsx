import EventEmitter from 'events';
import { w3cwebsocket as WebSocketClient } from 'websocket';
import { DISALLOWED_MESSAGE_TYPES } from '../config';
import MessageSerializer from '../message-serializer';
import SocketExtensionMap from '../socket-extension-map';

/**
 * Represents a WSX client.
 * @class Client
 */
export default class Client extends EventEmitter {
  /**
   * Connection event, fired when the socket has connected successfully.
   * @event connect
   * @memberof Client
   */

  /**
   * Disconnection event, fired when the socket disconnects.
   * @event disconnect
   * @memberof Client
   * @param {number} code Close status code sent by the server.
   * @param {string} reason Reason why the server closed the connection.
   * @param {boolean} wasClean Indicates whether or not the connection was
   * cleanly closed.
   */

  /**
   * Error event, fired when an unexpected socket error occurs.
   * @event error
   * @memberof Client
   */

  /**
   * Direct reference to the underlying extended WebSocket instance.
   * @type {websocket.w3cwebsocket}
   * @private
   */
  base;

  /**
   * Socket extensions to be applied on every managed socket.
   * @type {SocketExtensionMap}
   */
  socketExtensions = new SocketExtensionMap();

  /**
   * Message serializer instance.
   * @type {MessageSerializer}
   */
  messageSerializer = MessageSerializer;

  /**
   * @param {string} url URL of the WebSocket server to which to connect.
   * @param {Object} [options] Options to construct the client with.
   * @param {string[]} [options.protocols] Protocols to be used if possible.
   * @param {Function[]} [options.plugins] Plugins to be used, each defined
   * as a function taking the constructed client instance as a parameter.
   */
  constructor(url, options = {}) {
    super();

    this.base = this.socketExtensions.apply(
      new WebSocketClient(url, options.protocols),
      this
    );

    this.base.onopen = () => this.emit('connect');
    this.base.onclose = ({ code, reason, wasClean }) =>
      this.emit('disconnect', code, reason, wasClean);

    this.base.onmessage = ({ data }) => {
      const deserializedData = this.messageSerializer.deserialize(data);
      const { data: [type, ...params] } = deserializedData;

      // Validate message type
      if (type && type.constructor === String) {
        if (DISALLOWED_MESSAGE_TYPES.indexOf(type) < 0) {
          // TODO: Throw an exception
          return;
        }

        // TODO: Add support for channels
        this.emit(type, ...params);
      } else {
        // Emit typeless message event
        this.emit('message', deserializedData);
      }
    };

    this.base.onerror = () => this.emit('error');

    // Parse custom options
    const { plugins = [] } = options;

    // Initialize plugins
    for (const plugin of plugins) {
      plugin(this);
    }
  }

  /**
   * Transmits a raw message to the server.
   * @param {*} data Raw message data.
   */
  send(data) {
    this.base.send(data);
  }

  /**
   * Emits an event to the server.
   * @param {string} type Type of the event.
   * @param {...*} [params] Parameters of the event.
   */
  emit(type, ...params) {
    this.base.emit(type, ...params);
  }

  /**
   * Closes the connection or connection attempt, if any.
   * @param {number} [code] Status code explaining why the connection is being
   * closed.
   * @param {string} [reason] A human-readable string explaining why the
   * connection is closing. This string must be no longer than 123 bytes of
   * UTF-8 text (not characters).
   */
  disconnect(code, reason) {
    this.base.close(code, reason);
  }
}
