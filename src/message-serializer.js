/**
 * Serializes and deserializes messages transmitted over a WebSocket connection.
 * @class MessageSerializer
 */
export default class MessageSerializer {
  /**
   * Serializes a message to be sent over a WebSocket connection.
   * @param {string} channel Channel of the message.
   * @param {string} type Type of the message.
   * @param {*} [payload] Payload of the message.
   * @returns {string}
   */
  static serialize(channel, type, payload) {
    // Transform messages to JSON strings
    return JSON.stringify([channel, type, ...(payload ? [payload] : [])]);
  }

  /**
   * Deserializes a message received over a WebSocket connection.
   * @param {*} data Serialized message data.
   * @returns {*}
   */
  static deserialize(data) {
    // Parse JSON-serialized strings
    return data && data.constructor === String ?
      JSON.parse(data) :
      data;
  }
}
