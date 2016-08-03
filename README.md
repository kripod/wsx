# wsx

WebSockets with extensions, implemented in JavaScript.

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
wsxServer.on('message:echo', (client, payload) => {
  client.send('echo', payload);
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

You can broadcast messages or send them to client groups.

```js
wsxServer.on('message', (client, data) => {
  // Forward the message to everyone else except for the client that sent it
  client.broadcast(data);

  // Forward the message to everyone, including the client that sent it
  wsxServer.clients.send(data);

  // Forward the message to a specific group of clients
  wsxServer.getClientGroup('clientGroupId').send(data);
});
```

### Client groups

Client groups can be established on the server to handle multiple clients with
ease. Their underlying `Set` of clients is managed automatically, meaning that
you don't need to care about removing disconnected clients.

```js
wsxServer.on('message:join', (client, groupId) => {
  // Inexistent client groups are created automatically
  wsxServer.getClientGroup(groupId).add(client);
  client.broadcast('join', groupId);
});

wsxServer.on('message:leave', (client, groupId) => {
  // Client groups with zero clients are destroyed automatically
  wsxServer.getClientGroup(groupId).remove(client);
  client.broadcast('leave', groupId);
});

wsxClient.send('join', 'developers');
```

### Error handling

Message transmission errors are handled asynchronously:

```js
wsxServer.on('error', (error, client) => {
  // Server error
  if (client) {
    // The error has a client involved
  }
});

wsxClient.on('error', () => {
  // Client error
});
```

<a href="#api-reference"></a>

## API Reference

### Client

**Extends EventEmitter**

WebSocket client with extensions.

#### base

Direct reference to the underlying WebSocket client implementation.

#### constructor

**Parameters**

-   `url` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** URL of the WebSocket server to which to connect.
-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Options to construct the client with.
    -   `options.protocols` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>]** Protocols to be used if possible.
    -   `options.plugins` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)>]** Plugins to be used, each defined
        as a function taking the constructed client instance as a parameter.

#### send

Transmits data to the server.

**Parameters**

-   `params` **\[...Any]** Data to be sent.

#### disconnect

Closes the connection or connection attempt, if any.

**Parameters**

-   `code` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** Status code explaining why the connection is being
    closed.
-   `reason` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** A human-readable string explaining why the
    connection is closing. This string must be no longer than 123 bytes of
    UTF-8 text (not characters).

#### connect

Connection event, fired when the client has connected successfully.

#### disconnect

Disconnection event, fired when the client disconnects.

**Parameters**

-   `code` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Close status code sent by the server.
-   `reason` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Reason why the server closed the connection.
-   `wasClean` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Indicates whether or not the connection was
    cleanly closed.

#### message

Generic message event, fired when any message is received.

**Parameters**

-   `data` **Any** Full message data.

#### message:\[type]

Typeful message event, fired when a typeful message is received.

**Parameters**

-   `payload` **Any** Payload of the message.

#### error

Error event, fired when an unexpected error occurs.

### ClientGroup

**Extends Set**

Represents a group of clients.

#### clear

Removes all clients from the group.

#### delete

Removes the specified client from the group.

**Parameters**

-   `client` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Client to be removed.

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** `true` if the client has been removed successfully;
otherwise `false`.

#### send

Transmits data to every client in the group.

**Parameters**

-   `params` **\[...Any]** Data to be sent.

### Server

**Extends EventEmitter**

WebSocket server with extensions.

#### base

Direct reference to the underlying WebSocket server implementation.

#### clients

Store for every connected client.

#### constructor

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Options to construct the server with. Every option
    is passed to the underlying WebSocket server implementation.
    -   `options.plugins` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)>]** Plugins to be used, each defined
        as a function taking the constructed server instance as a parameter.
-   `successCallback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Function to be executed on successful
    initialization.

#### getClientGroup

Retrieves a client group by its ID. Creates a new group if necessary.

**Parameters**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** ID of the group.

Returns **Group** 

#### connect

Connection event, fired when a client has connected successfully.

**Parameters**

-   `client` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Connected client instance.

#### disconnect

Disconnection event, fired when a client disconnects.

**Parameters**

-   `client` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Disconnected client instance.
-   `code` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Close status code sent by the client.
-   `reason` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Reason why the client closed the connection.

#### error

Error event, fired when an unexpected error occurs.

**Parameters**

-   `error` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Error object.
-   `client` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Client causing the error.

#### message:\[type]

Typeful message event, fired when a typeful message is received.

**Parameters**

-   `client` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Sender of the message.
-   `payload` **Any** Payload of the message.

#### message

Generic message event, fired when any message is received.

**Parameters**

-   `client` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Sender of the message.
-   `data` **Any** Full message data.

### ClientExtensions

Provides method extensions for WebSocket clients.

**Parameters**

-   `client`  
-   `superSend`  
-   `params` **...Any** 

#### send

Transmits data to the client.

**Parameters**

-   `client` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Client instance of the receiver.
-   `superSend` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Super `send` function of the client.
-   `params` **\[...Any]** Data to be sent.

#### broadcast

Transmits data to everyone else except for the client that starts it.

**Parameters**

-   `clients` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** Client instances to broadcast data
    between.
-   `senderClient` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Client instance of the sender.
-   `params` **\[...Any]** Data to be sent.

### MessageSerializer

Serializes and deserializes messages transmitted over a WebSocket connection.

**Parameters**

-   `data`  

#### serializeMessage

Serializes a message to be sent over a WebSocket connection.

**Parameters**

-   `data` **Any** Full message data.

Returns **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Buffer](https://nodejs.org/api/buffer.html) \| [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer))** 

#### deserializeMessage

Deserializes a message received over a WebSocket connection.

**Parameters**

-   `data` **Any** Full message data.

Returns **Any** 
