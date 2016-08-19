import EventEmitter from 'events';
import { Server as WebSocketServer } from 'uws';
import SocketGroup from './socket-group';
import { DISALLOWED_MESSAGE_TYPES } from '../config';
import MessageSerializer from '../message-serializer';
import SocketExtensionMap from '../socket-extension-map';

/**
 * Represents a WSX server.
 * @class Server
 */
export default class Server extends EventEmitter {
  /**
   * Connection event, fired when a socket has connected successfully.
   * @event connection
   * @memberof Server
   * @param {ServerSideSocket} socket Connected socket instance.
   */

  /**
   * Error event, fired when an unexpected server error occurs.
   * @event error
   * @memberof Server
   * @param {Object} error Error object.
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
     * Emits an event to everyone else except for the socket that initiates it.
     * @name broadcast
     * @memberof ServerSideSocket
     * @param {string} type Type of the event.
     * @param {...*} [params] Parameters of the event.
     */
    this.socketExtensions.set('broadcast', (socket) =>
      (type, ...params) => {
        this.bulkSend(
          [...this.sockets].filter((socket2) => socket2 !== socket),
          this.messageSerializer.serialize(type, ...params)
        );
      }
    );

    this.base = new WebSocketServer(options, successCallback);

    this.base.on('connection', (socket) => {
      // Extend the functionality of sockets
      this.socketExtensions.apply(socket, this);

      // Add the connected socket to the main group of sockets
      this.sockets.add(socket);

      socket.on('close', () => {
        // Remove the disconnected socket from every group
        this.sockets.delete(socket);
        for (const socketGroup of Object.values(this.socketGroups)) {
          socketGroup.delete(socket);
        }
      });

      socket.on('message', (data) => {
        const deserializedData = this.messageSerializer.deserialize(data);
        const { data: [type, ...params] } = deserializedData;

        // Validate message type
        if (type && type.constructor === String) {
          if (DISALLOWED_MESSAGE_TYPES.indexOf(type) < 0) {
            // TODO: Throw an exception
            return;
          }

          // TODO: Add support for channels
          socket.emit(type, ...params);
        } else {
          // Emit typeless message event
          socket.emit('message', deserializedData);
        }
      });

      this.emit('connection', socket);
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
   * Transmits a raw message to the given sockets.
   * @param {ServerSideSocket[]} sockets Sockets to send the message to.
   * @param {*} data Raw message data.
   * @private
   */
  bulkSend(sockets, data) {
    const preparedMessage = this.base.prepareMessage(data);
    for (const socket of sockets) {
      socket.sendPrepared(preparedMessage);
    }
    this.base.finalizeMessage(preparedMessage);
  }
}
