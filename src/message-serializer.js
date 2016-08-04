/**
 * Serializes and deserializes messages transmitted over a WebSocket connection.
 * @class MessageSerializer
 */
export default class MessageSerializer {
  /**
   * Parent of the message serializer.
   * @type {EventEmitter}
   * @private
   */
  parent;

  /**
   * @param {EventEmitter} parent Parent of the message serializer.
   */
  constructor(parent) {
    this.parent = parent;
  }

  /**
   * Serializes a message to be sent over a WebSocket connection.
   * @param {...*} [params] Parameters of the message to be constructed.
   * @returns {string|Buffer|ArrayBuffer}
   */
  serialize(...params) {
    const [type, payload] = params;

    // Transform typeful messages to JSON
    const data = type && type.constructor === String ? {
      type,
      ...(payload && { payload }),
    } : type;

    // Transform non-buffer data to string
    return data instanceof Buffer || data instanceof ArrayBuffer ?
      data :
      JSON.stringify(data);
  }

  /**
   * Deserializes a message received over a WebSocket connection.
   * @param {*} serializedData Serialized message data.
   * @param {ServerSocket} [client] Socket of the message's sender.
   * @returns {*}
   */
  deserialize(serializedData, client) {
    // Parse JSON-serialized strings
    const data = serializedData && serializedData.constructor === String ?
      JSON.parse(serializedData) :
      serializedData;

    // Emit a generic message event
    this.parent.emit('message', ...(
      client ?
        [client, data] :
        [data]
    ));

    // Emit a special event for typeful messages
    const { type, payload } = data;
    if (type && type.constructor === String) {
      this.parent.emit(`message:${type}`, ...(
        client ?
          [client, payload] :
          [payload]
      ));
    }

    return data;
  }
}
