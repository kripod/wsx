/**
 * Serializes and deserializes messages transmitted over a WebSocket connection.
 * @namespace MessageSerializer
 */

/**
 * Serializes a message to be sent over a WebSocket connection.
 * @memberof MessageSerializer
 * @param {*} data Full message data.
 * @returns {string|Buffer|ArrayBuffer}
 */
export function serializeMessage(data) {
  // Transform non-buffer data to string
  return data instanceof Buffer || data instanceof ArrayBuffer ?
    data :
    JSON.stringify(data);
}

/**
 * Deserializes a message received over a WebSocket connection.
 * @memberof MessageSerializer
 * @param {*} data Full message data.
 * @returns {*}
 */
export function deserializeMessage(data) {
  // Parse JSON-serialized strings
  return data && data.constructor === String ?
    JSON.parse(data) :
    data;
}
