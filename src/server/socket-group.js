/**
 * Represents a group of sockets.
 * @class SocketGroup
 */
export default class SocketGroup extends Set {
  /**
   * Parent of the group.
   * @type {Server}
   * @private
   */
  parent;

  /**
   * @param {Server} [parent] Parent of the group.
   * @private
   */
  constructor(parent) {
    super();

    this.parent = parent;
  }

  /**
   * Removes all sockets from the group.
   */
  clear() {
    super.clear();

    // Delete the group from its parent if necessary
    if (this.parent) {
      for (const [key, value] of Object.entries(this.parent.socketGroups)) {
        if (value === this) {
          delete this.parent.socketGroups[key];
          return;
        }
      }
    }
  }

  /**
   * Removes the specified socket from the group.
   * @param {ServerSideSocket} socket Socket to be removed.
   * @returns {boolean} `true` if the socket has been removed successfully;
   * otherwise `false`.
   */
  delete(socket) {
    const result = super.delete(socket);
    if (result && this.size === 0) {
      this.clear();
    }
    return result;
  }

  /**
   * Transmits a raw message to every socket in the group.
   * @param {*} data Raw message data.
   */
  send(data) {
    this.parent.bulkSend(this, data);
  }

  /**
   * Emits an event to every socket in the group.
   * @param {string} type Type of the event.
   * @param {...*} [params] Parameters of the event.
   */
  emit(type, ...params) {
    this.parent.bulkSend(
      this,
      this.parent.messageSerializer.serialize(type, ...params)
    );
  }
}
