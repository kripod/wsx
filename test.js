import test from 'ava';
import portfinder from 'portfinder';
import Client from './src/client';
import Server from './src/server';

const DEFAULT_CLIENT_COUNT = 4;

function createServerWithClientsAsync(
  clientCount = DEFAULT_CLIENT_COUNT,
  serverOptions,
  clientOptions
) {
  return new Promise((resolve) => {
    // Find a free port for the server
    portfinder.getPort((err, port) => {
      resolve([
        new Server(Object.assign({ port }, serverOptions)),
        Array.from(
          new Array(clientCount),
          () => new Client(`ws://localhost:${port}`, clientOptions)
        ),
      ]);
    });
  });
}

test.cb('connect/disconnect', (t) => {
  createServerWithClientsAsync()
    .then(([server, clients]) => {
      t.is(server.sockets.size, 0);

      let connectedClientCount = 0;

      server
        .on('connect', () => {
          t.is(server.sockets.size, ++connectedClientCount);
          if (connectedClientCount === DEFAULT_CLIENT_COUNT) {
            // Disconnect clients
            for (const client of clients) {
              client.disconnect();
            }
          }
        })
        .on('disconnect', () => {
          t.is(server.sockets.size, --connectedClientCount);
          if (connectedClientCount === 0) {
            t.end();
          }
        });
    });
});

test('plugins', async (t) => {
  const [server, [client]] = await createServerWithClientsAsync(
    1,
    /* eslint-disable no-param-reassign */
    { plugins: [(wsxServer) => { wsxServer.isPluginTestSuccessful = true; }] },
    { plugins: [(wsxClient) => { wsxClient.isPluginTestSuccessful = true; }] },
    /* eslint-enable no-param-reassign */
  );

  t.true(server.isPluginTestSuccessful);
  t.true(client.isPluginTestSuccessful);
});

test.cb('send/receive data', (t) => {
  createServerWithClientsAsync()
    .then(([server, [client]]) => {
      server.on('message:echo', (socket, payload) => {
        t.is(payload, 'ping');
        socket.send('echo', 'pong');
      });

      client
        .on('connect', () => client.send('echo', 'ping'))
        .on('message:echo', (payload) => {
          t.is(payload, 'pong');
          t.end();
        });
    });
});

test.cb('broadcast data', (t) => {
  createServerWithClientsAsync()
    .then(([server, clients]) => {
      server.on('message:say', (socket, payload) => {
        t.is(payload, 'hi');
        socket.broadcast('say', payload);
      });

      let messagesReceived = 0;
      clients.forEach((client, i) => {
        if (i > 0) {
          client.on('message:say', (payload) => {
            t.is(payload, 'hi');
            if (++messagesReceived === DEFAULT_CLIENT_COUNT - 1) {
              t.end();
            }
          });
        } else {
          client
            .on('connect', () => client.send('say', 'hi'))
            .on('message:say', () => t.fail());
        }
      });
    });
});

test.cb('socket groups', (t) => {
  // TODO: Ensure that there is no empty socket groups left when every socket of
  // a group disconnects
  createServerWithClientsAsync()
    .then(([server, clients]) => {
      let messagesReceived = 0;
      server.on('message:join', (socket, groupId) => {
        let socketGroup = server.getSocketGroup(groupId);
        if (socketGroup.add(socket).size === 1) {
          // Remove socket from the group
          t.not(server.socketGroups[groupId], undefined);
          t.true(socketGroup.delete(socket));
          t.false(socketGroup.delete(socket));
          t.is(server.socketGroups[groupId], undefined);

          // Re-add socket to the group
          server.getSocketGroup(groupId).add(socket);
        }

        if (++messagesReceived === DEFAULT_CLIENT_COUNT - 1) {
          for (let i = 1; i >= 0; --i) {
            socketGroup = server.getSocketGroup(`group${i}`);
            t.is(socketGroup.size, i + 1);

            // Clear the group
            socketGroup.send('clear');
            t.not(server.socketGroups[`group${i}`], undefined);
            socketGroup.clear();
            t.is(server.socketGroups[`group${i}`], undefined);
          }
        }
      });

      clients[0].on('message:clear', () => t.end());

      clients[0].on('connect', () => clients[0].send('join', 'group0'));
      clients[1].on('connect', () => clients[1].send('join', 'group1'));
      clients[2].on('connect', () => clients[2].send('join', 'group1'));
    });
});
