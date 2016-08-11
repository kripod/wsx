/**
 * Serializes and deserializes messages transmitted over a WebSocket connection.
 * @class MessageSerializer
 */
export default class MessageSerializer {
  /**
   * Serializes a message to be sent over a WebSocket connection.
   * @param {string} type Type of the message.
   * @param {*} [payload] Payload of the message.
   * @returns {string}
   */
  static serialize(type, payload) {
    // Transform messages to JSON strings
    return JSON.stringify({
      type,
      ...(payload && { payload }),
    });
  }

  /**
   * Deserializes a message received over a WebSocket connection.
   * @param {string} data Serialized message data.
   * @returns {Object}
   */
  static deserialize(data) {
    // Parse JSON-serialized strings
    return data && data.constructor === String ?
      JSON.parse(data) :
      data;
  }
}
