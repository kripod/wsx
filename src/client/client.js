import EventEmitter from 'events';
import { w3cwebsocket as WebSocketClient } from 'websocket';
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
   * @instance
   */

  /**
   * Disconnection event, fired when the socket disconnects.
   * @event disconnect
   * @memberof Client
   * @instance
   * @param {number} code Close status code sent by the server.
   * @param {string} reason Reason why the server closed the connection.
   * @param {boolean} wasClean Indicates whether or not the connection was
   * cleanly closed.
   */

  /**
   * Message event, fired when a typeful message is received.
   * @event message:[type]
   * @memberof Client
   * @instance
   * @param {*} payload Payload of the message.
   */

  /**
   * Raw message event, fired when a typeless message is received.
   * @event rawMessage
   * @memberof Client
   * @instance
   * @param {*} data Data of the message.
   */

  /**
   * Error event, fired when an unexpected error occurs.
   * @event error
   * @memberof Client
   * @instance
   */

  /**
   * Direct reference to the underlying extended WebSocket instance.
   * @type {websocket.w3cwebsocket}
   * @private
   */
  base;

  /**
   * Channel used for message transmission.
   * @type {string}
   */
  channel = '';

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

    this.base.onerror = () => this.emit('error');
    this.base.onopen = () => this.emit('connect');
    this.base.onclose = ({ code, reason, wasClean }) =>
      this.emit('disconnect', code, reason, wasClean);

    this.base.onmessage = ({ data }) => {
      const deserializedData = this.messageSerializer.deserialize(data);
      const [channel, type, payload] = deserializedData;

      // Check whether the message is not raw
      if (
        channel !== null &&
        channel.constructor === String &&
        type &&
        type.constructor === String
      ) {
        // TODO: Forward message to the given channel
        this.emit(`message:${type}`, payload);
      } else {
        this.emit('rawMessage', deserializedData);
      }
    };

    // Parse custom options
    const { plugins = [] } = options;

    // Initialize plugins
    for (const plugin of plugins) {
      plugin(this);
    }
  }

  /**
   * Transmits a message to the server.
   * @param {string} type Type of the message.
   * @param {*} [payload] Payload of the message.
   */
  send(type, payload) {
    this.base.send(type, payload);
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
    // Detach error handler to avoid emitting errors unintentionally
    this.base.onerror = () => {};
    this.base.close(code, reason);
  }
}
