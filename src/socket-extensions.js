/**
 * Provides extensions for sockets.
 * @namespace SocketExtensions
 */

function getSharedSocketExtensions(socket, messageSerializer) {
  const sendRaw = socket.send.bind(socket);

  return {
    /**
     * Transmits a message through the socket.
     * @name Socket#send
     * @memberof SocketExtensions
     * @param {string} type Type of the message.
     * @param {*} [payload] Payload of the message.
     */
    send: (type, payload) => {
      sendRaw(messageSerializer.serialize(type, payload));
    },
  };
}

/**
 * Applies extensions on a client side socket.
 * @memberof SocketExtensions
 * @param {ClientSideSocket} socket Socket to apply extensions on.
 * @param {Client} client Client instance which the socket is owned by.
 * @returns {ClientSideSocket} Modified socket.
 * @private
 */
export function extendClientSideSocket(socket, client) {
  return Object.assign(
    socket,
    getSharedSocketExtensions(socket, client.messageSerializer)
  );
}

/**
 * Applies extensions on a server socket.
 * @memberof SocketExtensions
 * @param {ServerSideSocket} socket Socket to apply extensions on.
 * @param {Server} server Server instance which the socket is owned by.
 * @returns {ServerSideSocket} Modified socket.
 * @private
 */
export function extendServerSideSocket(socket, server) {
  const serverSideSocketExtensions = {
    /**
     * Transmits a message to everyone else except for the socket that starts
     * it.
     * @name ServerSideSocket#broadcast
     * @memberof SocketExtensions
     * @param {string} type Type of the message.
     * @param {*} [payload] Payload of the message.
     */
    broadcast: (type, payload) => {
      for (const socket2 of server.sockets) {
        if (socket2 !== this) {
          socket2.send(type, payload);
        }
      }
    },
  };

  return Object.assign(
    socket,
    getSharedSocketExtensions(socket, server.messageSerializer),
    serverSideSocketExtensions
  );
}
