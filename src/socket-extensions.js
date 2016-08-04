import { serializeMessage } from './message-serializer';

/**
 * Provides extensions for sockets.
 * @namespace SocketExtensions
 */

function getSharedSocketExtensions(socket) {
  const sendRaw = socket.send.bind(socket);

  return {
    /**
     * Transmits data through the socket.
     * @name Socket#send
     * @memberof SocketExtensions
     * @param {...*} [params] Data to be sent.
     */
    send: (...params) => {
      const [type, payload] = params;

      sendRaw(serializeMessage(
        // Transform typeful messages to JSON
        type && type.constructor === String ? {
          type,
          ...(payload && { payload }),
        } : params[0]
      ));
    },
  };
}

/**
 * Applies extensions on a client socket.
 * @memberof SocketExtensions
 * @param {ClientSideSocket} socket Socket to apply extensions on.
 * @returns {ClientSideSocket} Modified socket.
 * @private
 */
export function extendClientSideSocket(socket) {
  return Object.assign(
    socket,
    getSharedSocketExtensions(socket)
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
     * Transmits data to everyone else except for the socket that starts it.
     * @name ServerSideSocket#broadcast
     * @memberof SocketExtensions
     * @param {...*} [params] Data to be sent.
     */
    broadcast: (...params) => {
      for (const socket2 of server.clients) {
        if (socket2 !== this) {
          socket2.send(...params);
        }
      }
    },
  };

  return Object.assign(
    socket,
    getSharedSocketExtensions(socket),
    serverSideSocketExtensions
  );
}
