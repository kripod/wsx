import EventEmitter from 'events';
import { Server as WebSocketServer } from 'uws';
import SocketGroup from './socket-group';
import MessageSerializer from '../message-serializer';
import SocketExtensionMap from '../socket-extension-map';

/**
 * Represents a WSX server.
 * @class Server
 */
export default class Server extends EventEmitter {
  /**
   * Connection event, fired when a socket has connected successfully.
   * @event connect
   * @memberof Server
   * @instance
   * @param {ServerSideSocket} socket Connected socket instance.
   */

  /**
   * Disconnection event, fired when a socket disconnects.
   * @event disconnect
   * @memberof Server
   * @instance
   * @param {ServerSideSocket} socket Disconnected socket instance.
   * @param {number} code Close status code sent by the socket.
   * @param {string} reason Reason why the socket closed the connection.
   */

  /**
   * Message event, fired when a typeful message is received.
   * @event message:[type]
   * @memberof Server
   * @instance
   * @param {ServerSideSocket} socket Socket of the message's sender.
   * @param {*} payload Payload of the message.
   */

  /**
   * Raw message event, fired when a typeless message is received.
   * @event rawMessage
   * @memberof Server
   * @instance
   * @param {ServerSideSocket} socket Socket of the message's sender.
   * @param {*} data Data of the message.
   */

  /**
   * Error event, fired when an unexpected error occurs.
   * @event error
   * @memberof Server
   * @instance
   * @param {Object} error Error object.
   * @param {ServerSideSocket} [socket] Socket which caused the error.
   */

  /**
   * Direct reference to the underlying extended WebSocket instance.
   * @type {uws.Server}
   * @private
   */
  base;

  /**
   * Channel used for message transmission.
   * @type {string}
   */
  channel = '';

  /**
   * Store for every connected socket.
   * @type {SocketGroup}
   */
  sockets = new SocketGroup();

  /**
   * Store for socket groups.
   * @type {Object.<string, SocketGroup>}
   * @private
   */
  socketGroups = {};

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
   * @param {Object} options Options to construct the server with. Every option
   * is passed to the underlying WebSocket server implementation.
   * @param {Function[]} [options.plugins] Plugins to be used, each defined
   * as a function taking the constructed server instance as a parameter.
   * @param {Function} successCallback Function to be executed on successful
   * initialization.
   */
  constructor(options, successCallback) {
    super();

    /**
     * Transmits a message to everyone else except for the socket that starts
     * it.
     * @name broadcast
     * @memberof ServerSideSocket
     * @param {string} type Type of the message.
     * @param {*} [payload] Payload of the message.
     * @param {ServerSideSocket[]} [sockets] Sockets to broadcast the message
     * between.
     */
    this.socketExtensions.set('broadcast', (socket) =>
      (type, payload, sockets = this.sockets) => {
        this.bulkSend(
          [...sockets].filter((socket2) => socket2 !== socket),
          type,
          payload
        );
      }
    );

    this.base = new WebSocketServer(options, successCallback)
      .on('error', (error) => this.emit('error', error))
      .on('connection', (socket) => {
        // Extend the functionality of sockets
        this.socketExtensions.apply(socket, this);

        // Add the connected socket to the main group of sockets
        this.sockets.add(socket);

        socket
          .on('error', (error) => this.emit('error', error, socket))
          .on('close', (code, reason) => {
            // Remove the disconnected socket from every group
            this.sockets.delete(socket);
            for (const socketGroup of Object.values(this.socketGroups)) {
              socketGroup.delete(socket);
            }

            this.emit('disconnect', socket, code, reason);
          })
          .on('message', (data) => {
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
              this.emit(`message:${type}`, socket, payload);
            } else {
              this.emit('rawMessage', socket, deserializedData);
            }
          });

        this.emit('connect', socket);
      });

    // Parse custom options
    const { plugins = [] } = options;

    // Initialize plugins
    for (const plugin of plugins) {
      plugin(this);
    }
  }

  /**
   * Retrieves a socket group by its ID. Creates a new group if necessary.
   * @param {string} id ID of the group.
   * @returns {Group}
   */
  getSocketGroup(id) {
    let group = this.socketGroups[id];
    if (!group) {
      group = new SocketGroup(this);
      this.socketGroups[id] = group;
    }
    return group;
  }

  /**
   * Transmits a message to the given sockets.
   * @param {ServerSideSocket[]} sockets Sockets to send the message to.
   * @param {string} type Type of the message.
   * @param {*} [payload] Payload of the message.
   */
  bulkSend(sockets, type, payload) {
    const preparedMessage = this.base.prepareMessage(
      this.messageSerializer.serialize(this.channel, type, payload)
    );

    for (const socket of sockets) {
      socket.sendPrepared(preparedMessage);
    }

    this.base.finalizeMessage(preparedMessage);
  }
}
