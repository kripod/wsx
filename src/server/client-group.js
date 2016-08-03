/**
 * Represents a group of clients.
 * @class ClientGroup
 */
export default class ClientGroup extends Set {
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
   * Removes all clients from the group.
   */
  clear() {
    super.clear();

    // Delete the group from its parent if necessary
    if (this.parent) {
      for (const [key, value] of Object.entries(this.parent.clientGroups)) {
        if (value === this) {
          delete this.parent.clientGroups[key];
          return;
        }
      }
    }
  }

  /**
   * Removes the specified client from the group.
   * @param {Object} client Client to be removed.
   * @returns {boolean} `true` if the client has been removed successfully;
   * otherwise `false`.
   */
  delete(client) {
    const result = super.delete(client);
    if (result && this.size === 0) {
      this.clear();
    }
    return result;
  }

  /**
   * Transmits data to every client in the group.
   * @param {...*} [params] Data to be sent.
   */
  send(...params) {
    for (const client of this) {
      client.send(...params);
    }
  }
}
