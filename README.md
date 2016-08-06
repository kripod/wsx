# wsx

WebSockets with extensions, implemented in JavaScript.

[![Version (npm)](https://img.shields.io/npm/v/wsx.svg)](https://npmjs.com/package/wsx)
[![Build Status](https://img.shields.io/travis/kripod/wsx/master.svg)](https://travis-ci.org/kripod/wsx)
[![Code Coverage](https://img.shields.io/codecov/c/github/kripod/wsx/master.svg)](https://codecov.io/gh/kripod/wsx)
[![Gitter](https://img.shields.io/gitter/room/kripod/wsx.svg)](https://gitter.im/kripod/wsx)

## Introduction

WSX provides a lightweight abstraction layer over WebSockets, greatly increasing
developer productivity while aiming to provide blazing fast transmission rates
over the network without sacrificing stability and scalability.

## Getting started

Please refer to the
[API reference](https://github.com/kripod/wsx/blob/master/API.md) and the
[directory of examples](https://github.com/kripod/wsx/tree/master/examples) to
learn more about leveraging the possibilities within the library.

### Initializing communication channels

```js
import Client from 'wsx/client';
import Server from 'wsx/server';

const wsxServer = new Server({ port: 3000 });
const wsxClient = new Client('ws://localhost:3000');
```

_**Pro tip**: WSX tries to detect its environment automatically. This means that
`import Server from 'wsx';` is a valid statement for Node environments, and
`import Client from 'wsx';` is a valid statement for browser environments._

### Sending and receiving messages

WSX features an event-based messaging system with a syntax familiar for
[Socket.IO](http://socket.io) users. Messages are serialized and deserialized
automatically.

#### Example

```js
// Register an event handler on the server side for message type `echo`
wsxServer.on('message:echo', (socket, payload) => {
  socket.send('echo', payload);
});

// Register an event handler on the client side for message type `echo`
wsxClient.on('message:echo', (payload) => {
  console.log('Received message with type `echo` and the following payload:');
  console.log(payload);
});

// Transmit a message with type `echo` to the server
wsxClient.send('echo', 'Hello, World!');
```

#### Multiple recipients

You can broadcast messages or send them to socket groups.

```js
wsxServer.on('message', (socket, data) => {
  // Forward the message to everyone else except for the socket that sent it
  socket.broadcast(data);

  // Forward the message to everyone, including the socket that sent it
  wsxServer.sockets.send(data);

  // Forward the message to a specific group of sockets
  wsxServer.getSocketGroup('socketGroupId').send(data);
});
```

### Socket groups

Socket groups can be established on the server to handle multiple sockets with
ease. Their underlying `Set` of sockets is managed automatically, meaning that
you don't need to care about removing disconnected sockets.

```js
wsxServer.on('message:join', (socket, groupId) => {
  // Inexistent socket groups are created automatically
  wsxServer.getSocketGroup(groupId).add(socket);
  socket.broadcast('join', groupId);
});

wsxServer.on('message:leave', (socket, groupId) => {
  // Socket groups with zero sockets are destroyed automatically
  wsxServer.getSocketGroup(groupId).remove(socket);
  socket.broadcast('leave', groupId);
});

wsxClient.send('join', 'developers');
```

### Error handling

Message transmission errors are handled asynchronously:

```js
wsxServer.on('error', (error, socket) => {
  // Server error
  if (socket) {
    // The error was caused by a socket
  }
});

wsxClient.on('error', () => {
  // Client error
});
```

### Plugins

Plugins can be used to extend the capability of WSX.

```js
const wsxServerWithPlugins = new Server({
  port: 3001,
  plugins: [
    (wsxServer) => {
      // Modify the server instance
    },
  ],
});

const wsxClientWithPlugins = new Client('ws://localhost:3001', {
  plugins: [
    (wsxClient) => {
      // Modify the client instance
    },
  ],
});
```
