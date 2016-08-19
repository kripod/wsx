/**
 * Serializes and deserializes messages transmitted over a WebSocket connection.
 * @class MessageSerializer
 */
export default class MessageSerializer {
  /**
   * Serializes a message to be sent over a WebSocket connection.
   * @param {string} type Type of the message.
   * @param {...*} [params] Parameters of the message.
   * @returns {string}
   */
  static serialize(type, ...params) {
    // Transform messages to JSON strings
    return JSON.stringify([{
      // TODO: Add support for channels
      data: [type, ...params],
    }]);
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
