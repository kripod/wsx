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
  t.is(server.clients.size, 0);

  let connectedClientCount = 0;
  server.on('connect', () => {
    t.is(server.clients.size, ++connectedClientCount);

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

test.serial.cb('send/receive typeless data', (t) => {
  const expectedData = new ArrayBuffer(8);
  const eventsOrder = [];

  server.once('message', (client, data) => {
    t.deepEqual(data.byteLength, expectedData.byteLength);
    client.send(data);
    eventsOrder.push(1);
  });

  clients[0].once('message', (data) => {
    t.deepEqual(data.byteLength, expectedData.byteLength);
    eventsOrder.push(2);

    // Check whether the order of event execution was correct
    t.deepEqual(eventsOrder, [1, 2]);
    t.end();
  });

  clients[0].send(expectedData);
});

test.serial.cb('send/receive typeful data', (t) => {
  const expectedType = 'echo';
  const expectedPayload = { text: 'Hello, World!' };
  const expectedData = {
    type: expectedType,
    payload: expectedPayload,
  };
  const eventsOrder = [];

  server.once('message', (client, data) => {
    t.deepEqual(data, expectedData);
    eventsOrder.push(1);
  });

  server.once(`message:${expectedType}`, (client, payload) => {
    t.deepEqual(payload, expectedPayload);
    client.send(expectedType, expectedPayload);
    eventsOrder.push(2);
  });

  clients[0].once('message', (data) => {
    t.deepEqual(data, expectedData);
    eventsOrder.push(3);
  });

  clients[0].once(`message:${expectedType}`, (payload) => {
    t.deepEqual(payload, expectedPayload);
    eventsOrder.push(4);

    // Check whether the order of event execution was correct
    t.deepEqual(eventsOrder, [1, 2, 3, 4]);
    t.end();
  });

  clients[0].send(expectedType, expectedPayload);
});

test.serial.cb('broadcast data', (t) => {
  const expectedType = 'position';
  const expectedPayload = { x: 10, y: 20 };
  const expectedData = {
    type: expectedType,
    payload: expectedPayload,
  };

  server.once(`message:${expectedType}`, (client, payload) => {
    client.broadcast(expectedType, payload);
  });

  clients[0].once(`message:${expectedType}`, () => t.fail);

  let messagesReceived = 0;
  for (let i = CLIENT_COUNT - 1; i > 0; --i) {
    /* eslint-disable no-loop-func */
    clients[i].once(`message:${expectedType}`, (payload) => {
      /* eslint-enable no-loop-func */
      t.deepEqual(payload, expectedPayload);
      if (++messagesReceived === CLIENT_COUNT - 1) {
        t.end();
      }
    });
  }

  clients[0].send(expectedData);
});

test.serial.cb('client groups', (t) => {
  const groupIds = [
    'dc847faf83626c8e2c2dd2ce3eda1d9418f3705e',
    '5a149824a387790fcb8b3956a7d5e467692546fe',
  ];

  let messagesReceived = 0;
  server.on('message:join', (client, { id }) => {
    let clientGroup = server.getClientGroup(id);
    if (clientGroup.add(client).size === 1) {
      // Remove client from the group
      t.not(server.clientGroups[id], undefined);
      t.true(clientGroup.delete(client));
      t.false(clientGroup.delete(client));
      t.is(server.clientGroups[id], undefined);

      // Re-add client to the group
      clientGroup = server.getClientGroup(id).add(client);
    }

    if (++messagesReceived === 3) {
      for (let i = 1; i >= 0; --i) {
        clientGroup = server.getClientGroup(groupIds[i]);
        t.is(clientGroup.size, i + 1);

        // Clear the group
        clientGroup.send('clear');
        t.not(server.clientGroups[groupIds[i]], undefined);
        clientGroup.clear();
        t.is(server.clientGroups[groupIds[i]], undefined);
      }
    }
  });

  clients[0].once('message:clear', t.end);

  clients[0].send('join', { id: groupIds[0] });
  clients[1].send('join', { id: groupIds[1] });
  clients[2].send('join', { id: groupIds[1] });
});

test.serial.cb('disconnect', (t) => {
  server.once('message:join', () => {
    let connectedClientCount = CLIENT_COUNT;
    server.on('disconnect', () => {
      connectedClientCount -= 1;
      t.is(server.clients.size, connectedClientCount);

      if (connectedClientCount === 0) {
        // Ensure that there are no empty client groups left
        t.deepEqual(server.clientGroups, {});
        t.end();
      }
    });

    // Disconnect clients
    for (const client2 of clients) {
      client2.disconnect();
    }
  });

  // Simulate that a client is the only member of a group
  clients[0].send('join', { id: '42' });
});
