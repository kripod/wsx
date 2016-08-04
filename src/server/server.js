import EventEmitter from 'events';
import { Server as WebSocketServer } from 'uws';
import ClientGroup from './client-group';
import { extendServerSocket } from '../socket-extensions';
import { handleMessage } from '../utils';

/**
 * WebSocket server with extensions.
 * @class Server
 */
export default class Server extends EventEmitter {
  /**
   * Connection event, fired when a client has connected successfully.
   * @event connect
   * @memberof Server
   * @param {Object} client Connected client instance.
   */

  /**
   * Disconnection event, fired when a client disconnects.
   * @event disconnect
   * @memberof Server
   * @param {Object} client Disconnected client instance.
   * @param {number} code Close status code sent by the client.
   * @param {string} reason Reason why the client closed the connection.
   */

  /**
   * Generic message event, fired when any message is received.
   * @event message
   * @memberof Server
   * @param {Object} client Sender of the message.
   * @param {*} data Full message data.
   */

  /**
   * Typeful message event, fired when a typeful message is received.
   * @event message:[type]
   * @memberof Server
   * @param {Object} client Sender of the message.
   * @param {*} payload Payload of the message.
   */

  /**
   * Error event, fired when an unexpected error occurs.
   * @event error
   * @memberof Server
   * @param {Object} error Error object.
   * @param {Object} [client] Client causing the error.
   */

  /**
   * Direct reference to the underlying extended WebSocket instance.
   * @type {uws.Server}
   * @private
   */
  base;

  /**
   * Store for every connected client.
   * @type {ClientGroup}
   */
  clients = new ClientGroup();

  /**
   * Store for client groups.
   * @type {ClientGroup[]}
   * @private
   */
  clientGroups = {};

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
    this.base = new WebSocketServer(options, successCallback);

    this.base.on('connection', (client) => {
      // Extend the functionality of clients
      extendServerSocket(client, this);

      // Add the connected client to the main group of clients
      this.clients.add(client);

      client.on('close', (code, reason) => {
        // Remove the disconnected client from every group
        this.clients.delete(client);
        for (const clientGroup of Object.values(this.clientGroups)) {
          clientGroup.delete(client);
        }

        this.emit('disconnect', client, code, reason);
      });

      client.on('message', (data) => handleMessage(this, data, client));
      client.on('error', (error) => this.emit('error', error, client));

      this.emit('connect', client);
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
   * Retrieves a client group by its ID. Creates a new group if necessary.
   * @param {string} id ID of the group.
   * @returns {Group}
   */
  getClientGroup(id) {
    let group = this.clientGroups[id];
    if (!group) {
      group = new ClientGroup(this);
      this.clientGroups[id] = group;
    }
    return group;
  }
}
