import { deserializeMessage } from './message-serializer';

/* eslint-disable import/prefer-default-export */

/**
 * Utilities for client and server.
 * @namespace Utils
 * @private
 */

/**
 * Handles a WebSocket message, forwarding it to the given EventEmitter.
 * @memberof Utils
 * @param {EventEmitter} eventEmitter EventEmitter to forward the message to.
 * @param {*} serializedData Full, serialized message data.
 * @param {Socket} client Socket of the message's sender.
 */
export function handleMessage(eventEmitter, serializedData, client) {
  const data = deserializeMessage(serializedData);
  eventEmitter.emit('message', ...(
    client ?
      [client, data] :
      [data]
  ));

  // Emit a special event for typeful messages
  const { type, payload } = data;
  if (type && type.constructor === String) {
    eventEmitter.emit(`message:${type}`, ...(
      client ?
        [client, payload] :
        [payload]
    ));
  }
}
