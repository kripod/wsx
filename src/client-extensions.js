import { serializeMessage } from './message-serializer';

/**
 * Provides method extensions for WebSocket clients.
 * @namespace ClientExtensions
 */

/**
 * Transmits data to the client.
 * @param {Object} client Client instance of the receiver.
 * @param {Function} superSend Super `send` function of the client.
 * @param {...*} [params] Data to be sent.
 * @memberof ClientExtensions
 */
export function send(client, superSend, ...params) {
  const [type, payload] = params;

  superSend.call(client, serializeMessage(
    // Transform typeful messages to JSON
    type && type.constructor === String ? {
      type,
      ...(payload && { payload }),
    } : params[0]
  ));
}

/**
 * Transmits data to everyone else except for the client that starts it.
 * @param {Object[]} clients Client instances to broadcast data
 * between.
 * @param {Object} senderClient Client instance of the sender.
 * @param {...*} [params] Data to be sent.
 * @memberof ClientExtensions
 */
export function broadcast(clients, senderClient, ...params) {
  for (const client of clients) {
    if (client !== senderClient) {
      client.send(...params);
    }
  }
}
