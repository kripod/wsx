/**
 * Serializes and deserializes messages transmitted over a WebSocket connection.
 * @class MessageSerializer
 */
export default class MessageSerializer {
  /**
   * Serializes a message to be sent over a WebSocket connection.
   * @param {string} type Type of the message.
   * @param {*} [payload] Payload of the message.
   * @returns {string|Buffer|ArrayBuffer}
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
   * @param {*} serializedData Serialized message data.
   * @param {ServerSocket} [client] Socket of the message's sender.
   * @returns {*}
   */
  static deserialize(serializedData) {
    // Parse JSON-serialized strings
    return serializedData && serializedData.constructor === String ?
      JSON.parse(serializedData) :
      serializedData;
  }
}
