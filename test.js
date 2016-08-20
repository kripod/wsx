import test from 'ava';
import portfinder from 'portfinder';
import Client from './src/client';
import Server from './src/server';

const CLIENT_COUNT = 4;

let port;
let server;
const clients = [];

// Find a free port for the server
test.before.cb((t) => {
  portfinder.getPort((err, port2) => {
    port = port2;
    t.end();
  });
});

/* eslint-disable no-param-reassign */
test.serial.cb('connect', (t) => {
  // Initialize the server
  server = new Server({
    port,
    plugins: [(wsxServer) => { wsxServer.isPluginTestSuccessful = true; }],
  });
  t.is(server.sockets.size, 0);

  let connectedClientCount = 0;
  server.on('connection', () => {
    t.is(server.sockets.size, ++connectedClientCount);

    if (connectedClientCount === CLIENT_COUNT) {
      t.end();
    }
  });

  // Initialize clients
  for (let i = CLIENT_COUNT; i > 0; --i) {
    clients.push(new Client(`ws://localhost:${port}`, {
      plugins: [(wsxClient) => { wsxClient.isPluginTestSuccessful = true; }],
    }));
  }
});
/* eslint-enable no-param-reassign */

test.serial('plugins', (t) => {
  t.true(server.isPluginTestSuccessful);

  for (const client of clients) {
    t.true(client.isPluginTestSuccessful);
  }
});

test.serial.cb.skip('send/receive data', (t) => {
  const expectedType = 'echo';
  const expectedPayload = { text: 'Hello, World!' };
  const eventsOrder = [];

  const serverSocket = server.sockets.get(0);
  serverSocket.once(expectedType, (payload) => {
    t.deepEqual(payload, expectedPayload);
    serverSocket.send(expectedType, expectedPayload);
    eventsOrder.push(1);
  });

  clients[0].once(expectedType, (payload) => {
    t.deepEqual(payload, expectedPayload);
    eventsOrder.push(2);

    // Check whether the order of event execution was correct
    t.deepEqual(eventsOrder, [1, 2]);
    t.end();
  });

  clients[0].send(expectedType, expectedPayload);
});

test.serial.cb.skip('broadcast data', (t) => {
  const expectedType = 'position';
  const expectedPayload = { x: 10, y: 20 };

  const serverSocket = server.sockets.get(0);
  serverSocket.once(expectedType, (payload) => {
    serverSocket.broadcast(expectedType, payload);
  });

  clients[0].once(expectedType, () => t.fail());

  let messagesReceived = 0;
  for (let i = CLIENT_COUNT - 1; i > 0; --i) {
    /* eslint-disable no-loop-func */
    clients[i].once(expectedType, (payload) => {
      /* eslint-enable no-loop-func */
      t.deepEqual(payload, expectedPayload);
      if (++messagesReceived === CLIENT_COUNT - 1) {
        t.end();
      }
    });
  }

  clients[0].send(expectedType, expectedPayload);
});

test.serial.cb.skip('socket groups', (t) => {
  const groupIds = [
    'dc847faf83626c8e2c2dd2ce3eda1d9418f3705e',
    '5a149824a387790fcb8b3956a7d5e467692546fe',
  ];

  let messagesReceived = 0;
  server.on('message:join', (socket, { id }) => {
    let socketGroup = server.getSocketGroup(id);
    if (socketGroup.add(socket).size === 1) {
      // Remove socket from the group
      t.not(server.socketGroups[id], undefined);
      t.true(socketGroup.delete(socket));
      t.false(socketGroup.delete(socket));
      t.is(server.socketGroups[id], undefined);

      // Re-add socket to the group
      server.getSocketGroup(id).add(socket);
    }

    if (++messagesReceived === 3) {
      for (let i = 1; i >= 0; --i) {
        socketGroup = server.getSocketGroup(groupIds[i]);
        t.is(socketGroup.size, i + 1);

        // Clear the group
        socketGroup.send('clear');
        t.not(server.socketGroups[groupIds[i]], undefined);
        socketGroup.clear();
        t.is(server.socketGroups[groupIds[i]], undefined);
      }
    }
  });

  clients[0].once('message:clear', t.end);

  clients[0].send('join', { id: groupIds[0] });
  clients[1].send('join', { id: groupIds[1] });
  clients[2].send('join', { id: groupIds[1] });
});

test.serial.cb.skip('disconnect', (t) => {
  server.once('message:join', () => {
    let connectedClientCount = CLIENT_COUNT;
    server.on('disconnect', () => {
      connectedClientCount -= 1;
      t.is(server.sockets.size, connectedClientCount);

      if (connectedClientCount === 0) {
        // Ensure that there are no empty socket groups left
        t.deepEqual(server.socketGroups, {});
        t.end();
      }
    });

    // Disconnect clients
    for (const client of clients) {
      client.disconnect();
    }
  });

  // Simulate that a client is the only member of a group
  clients[0].send('join', { id: '42' });
});
