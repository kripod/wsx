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

Please refer to the directory of examples to see more comprehensive walkthroughs
leveraging the possibilities within the library.

### Initializing communication channels

```js
import Client from 'wsx/client';
import Server from 'wsx/server';

const wsxServer = new Server({ port: 3000 });
const wsxClient = new Client('ws://localhost:3000');
```

See the [API Reference](#api-reference) for further options.

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

<a href="#api-reference"></a>

## API Reference

### Client

**Extends EventEmitter**

WebSocket client with extensions.

#### socketExtensions

Socket extensions to be applied on every managed socket.

#### messageSerializer

Message serializer instance.

#### constructor

**Parameters**

-   `url` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** URL of the WebSocket server to which to connect.
-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Options to construct the client with.
    -   `options.protocols` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>]** Protocols to be used if possible.
    -   `options.plugins` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)>]** Plugins to be used, each defined
        as a function taking the constructed client instance as a parameter.

#### send

Transmits a message to the server.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of the message.
-   `payload` **\[Any]** Payload of the message.

#### disconnect

Closes the connection or connection attempt, if any.

**Parameters**

-   `code` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** Status code explaining why the connection is being
    closed.
-   `reason` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** A human-readable string explaining why the
    connection is closing. This string must be no longer than 123 bytes of
    UTF-8 text (not characters).

#### connect

Connection event, fired when the socket has connected successfully.

#### error

Error event, fired when an unexpected error occurs.

#### message:\[type]

Message event, fired when a typeful message is received.

**Parameters**

-   `payload` **Any** Payload of the message.

#### disconnect

Disconnection event, fired when the socket disconnects.

**Parameters**

-   `code` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Close status code sent by the server.
-   `reason` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Reason why the server closed the connection.
-   `wasClean` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Indicates whether or not the connection was
    cleanly closed.

### Server

**Extends EventEmitter**

WebSocket server with extensions.

#### socketExtensions

Socket extensions to be applied on every managed socket.

#### messageSerializer

Message serializer instance.

#### sockets

Store for every connected socket.

#### constructor

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Options to construct the server with. Every option
    is passed to the underlying WebSocket server implementation.
    -   `options.plugins` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)>]** Plugins to be used, each defined
        as a function taking the constructed server instance as a parameter.
-   `successCallback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Function to be executed on successful
    initialization.

#### getSocketGroup

Retrieves a socket group by its ID. Creates a new group if necessary.

**Parameters**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** ID of the group.

Returns **Group** 

#### connect

Connection event, fired when a socket has connected successfully.

**Parameters**

-   `socket` **[ServerSideSocket](#serversidesocket)** Connected socket instance.

#### disconnect

Disconnection event, fired when a socket disconnects.

**Parameters**

-   `socket` **[ServerSideSocket](#serversidesocket)** Disconnected socket instance.
-   `code` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Close status code sent by the socket.
-   `reason` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Reason why the socket closed the connection.

#### message:\[type]

Message event, fired when a typeful message is received.

**Parameters**

-   `socket` **[ServerSideSocket](#serversidesocket)** Socket of the message's sender.
-   `payload` **Any** Payload of the message.

#### error

Error event, fired when an unexpected error occurs.

**Parameters**

-   `error` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Error object.
-   `socket` **\[[ServerSideSocket](#serversidesocket)]** Socket which caused the error.

### ServerSideSocket

**Extends Socket**

Represents a socket owned by a server.

#### broadcast

Transmits a message to everyone else except for the socket that starts
it.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of the message.
-   `payload` **\[Any]** Payload of the message.

### MessageSerializer

Serializes and deserializes messages transmitted over a WebSocket connection.

#### serialize

Serializes a message to be sent over a WebSocket connection.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of the message.
-   `payload` **\[Any]** Payload of the message.

Returns **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Buffer](https://nodejs.org/api/buffer.html) \| [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer))** 

#### deserialize

Deserializes a message received over a WebSocket connection.

**Parameters**

-   `data` **Any** Serialized message data.

Returns **Any** 

### SocketExtensionSet

**Extends Set**

Represents a set of socket extensions.

#### constructor

**Parameters**

-   `iterable` **\[Any]** Elements to be initially added to the set.

#### apply

Applies the set of extensions on the given socket.

**Parameters**

-   `socket` **[Socket](#socket)** Socket to apply extensions on.
-   `parent` **([Server](#server) \| [Client](#client))** Parent of the given socket.

Returns **[Socket](#socket)** 

### Socket

**Extends Set**

Represents a socket owned by a server or a client.

#### send

Transmits a message through the socket.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of the message.
-   `payload` **\[Any]** Payload of the message.

### SocketGroup

**Extends Set**

Represents a group of sockets.

#### clear

Removes all sockets from the group.

#### delete

Removes the specified socket from the group.

**Parameters**

-   `socket` **[ServerSideSocket](#serversidesocket)** Socket to be removed.

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** `true` if the socket has been removed successfully;
otherwise `false`.

#### send

Transmits a message to every socket in the group.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of the message.
-   `payload` **\[Any]** Payload of the message.
