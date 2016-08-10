import EventEmitter from 'events';
import { Server as WebSocketServer } from 'uws';
import SocketGroup from './socket-group';
import MessageSerializer from '../message-serializer';
import SocketExtensionSet from '../socket-extension-set';

/**
 * Represents a WSX server.
 * @class Server
 */
export default class Server extends EventEmitter {
  /**
   * Connection event, fired when a socket has connected successfully.
   * @event connect
   * @memberof Server
   * @param {ServerSideSocket} socket Connected socket instance.
   */

  /**
   * Disconnection event, fired when a socket disconnects.
   * @event disconnect
   * @memberof Server
   * @param {ServerSideSocket} socket Disconnected socket instance.
   * @param {number} code Close status code sent by the socket.
   * @param {string} reason Reason why the socket closed the connection.
   */

  /**
   * Message event, fired when a typeful message is received.
   * @event message:[type]
   * @memberof Server
   * @param {ServerSideSocket} socket Socket of the message's sender.
   * @param {*} payload Payload of the message.
   */

  /**
   * Error event, fired when an unexpected error occurs.
   * @event error
   * @memberof Server
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
   * @type {SocketExtensionSet}
   */
  socketExtensions = new SocketExtensionSet();

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

    this.socketExtensions.add((socket) =>
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
      function broadcast(type, payload, sockets = socket.parent.sockets) {
        socket.parent.bulkSend(
          [...sockets].filter((socket2) => socket2 !== socket),
          type,
          payload
        );
      }
    );

    this.base = new WebSocketServer(options, successCallback);

    this.base.on('connection', (socket) => {
      // Extend the functionality of sockets
      this.socketExtensions.apply(socket, this);

      // Add the connected socket to the main group of sockets
      this.sockets.add(socket);

      socket.on('close', (code, reason) => {
        // Remove the disconnected socket from every group
        this.sockets.delete(socket);
        for (const socketGroup of Object.values(this.socketGroups)) {
          socketGroup.delete(socket);
        }

        this.emit('disconnect', socket, code, reason);
      });

      socket.on('message', (data) => {
        const { type, payload } = this.messageSerializer.deserialize(data);

        // Validate message type
        if (type && type.constructor === String) {
          this.emit(`message:${type}`, socket, payload);
        }
      });

      socket.on('error', (error) => this.emit('error', error, socket));

      this.emit('connect', socket);
    });

    this.base.on('error', (error) => this.emit('error', error));

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
      this.messageSerializer.serialize(type, payload)
    );

    for (const socket of sockets) {
      socket.sendPrepared(preparedMessage);
    }

    this.base.finalizeMessage(preparedMessage);
  }
}
