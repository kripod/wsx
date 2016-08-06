# Server

[src/server/server.js:11-170](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/server/server.js#L11-L170 "Source code on GitHub")

**Extends EventEmitter**

WebSocket server with extensions.

## sockets

[src/server/server.js:55-55](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/server/server.js#L55-L55 "Source code on GitHub")

Store for every connected socket.

## socketExtensions

[src/server/server.js:68-68](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/server/server.js#L68-L68 "Source code on GitHub")

Socket extensions to be applied on every managed socket.

## messageSerializer

[src/server/server.js:74-74](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/server/server.js#L74-L74 "Source code on GitHub")

Message serializer instance.

## constructor

[src/server/server.js:84-155](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/server/server.js#L84-L155 "Source code on GitHub")

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Options to construct the server with. Every option
    is passed to the underlying WebSocket server implementation.
    -   `options.plugins` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)>]** Plugins to be used, each defined
        as a function taking the constructed server instance as a parameter.
-   `successCallback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Function to be executed on successful
    initialization.

## getSocketGroup

[src/server/server.js:162-169](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/server/server.js#L162-L169 "Source code on GitHub")

Retrieves a socket group by its ID. Creates a new group if necessary.

**Parameters**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** ID of the group.

Returns **Group** 

## message:\[type]

[src/server/server.js:49-49](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/server/server.js#L49-L49 "Source code on GitHub")

Message event, fired when a typeful message is received.

**Parameters**

-   `socket` **[ServerSideSocket](#serversidesocket)** Socket of the message's sender.
-   `payload` **Any** Payload of the message.

## disconnect

[src/server/server.js:49-49](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/server/server.js#L49-L49 "Source code on GitHub")

Disconnection event, fired when a socket disconnects.

**Parameters**

-   `socket` **[ServerSideSocket](#serversidesocket)** Disconnected socket instance.
-   `code` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Close status code sent by the socket.
-   `reason` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Reason why the socket closed the connection.

## connect

[src/server/server.js:49-49](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/server/server.js#L49-L49 "Source code on GitHub")

Connection event, fired when a socket has connected successfully.

**Parameters**

-   `socket` **[ServerSideSocket](#serversidesocket)** Connected socket instance.

## error

[src/server/server.js:49-49](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/server/server.js#L49-L49 "Source code on GitHub")

Error event, fired when an unexpected error occurs.

**Parameters**

-   `error` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Error object.
-   `socket` **\[[ServerSideSocket](#serversidesocket)]** Socket which caused the error.

# Client

[src/client/client.js:10-118](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/client/client.js#L10-L118 "Source code on GitHub")

**Extends EventEmitter**

WebSocket client with extensions.

## socketExtensions

[src/client/client.js:51-51](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/client/client.js#L51-L51 "Source code on GitHub")

Socket extensions to be applied on every managed socket.

## messageSerializer

[src/client/client.js:57-57](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/client/client.js#L57-L57 "Source code on GitHub")

Message serializer instance.

## constructor

[src/client/client.js:66-96](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/client/client.js#L66-L96 "Source code on GitHub")

**Parameters**

-   `url` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** URL of the WebSocket server to which to connect.
-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Options to construct the client with.
    -   `options.protocols` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>]** Protocols to be used if possible.
    -   `options.plugins` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)>]** Plugins to be used, each defined
        as a function taking the constructed client instance as a parameter.

## send

[src/client/client.js:103-105](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/client/client.js#L103-L105 "Source code on GitHub")

Transmits a message to the server.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of the message.
-   `payload` **\[Any]** Payload of the message.

## disconnect

[src/client/client.js:115-117](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/client/client.js#L115-L117 "Source code on GitHub")

Closes the connection or connection attempt, if any.

**Parameters**

-   `code` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** Status code explaining why the connection is being
    closed.
-   `reason` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** A human-readable string explaining why the
    connection is closing. This string must be no longer than 123 bytes of
    UTF-8 text (not characters).

## error

[src/client/client.js:45-45](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/client/client.js#L45-L45 "Source code on GitHub")

Error event, fired when an unexpected error occurs.

## connect

[src/client/client.js:45-45](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/client/client.js#L45-L45 "Source code on GitHub")

Connection event, fired when the socket has connected successfully.

## disconnect

[src/client/client.js:45-45](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/client/client.js#L45-L45 "Source code on GitHub")

Disconnection event, fired when the socket disconnects.

**Parameters**

-   `code` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Close status code sent by the server.
-   `reason` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Reason why the server closed the connection.
-   `wasClean` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Indicates whether or not the connection was
    cleanly closed.

## message:\[type]

[src/client/client.js:45-45](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/client/client.js#L45-L45 "Source code on GitHub")

Message event, fired when a typeful message is received.

**Parameters**

-   `payload` **Any** Payload of the message.

# Socket

[src/socket-extension-set.js:16-55](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/socket-extension-set.js#L16-L55 "Source code on GitHub")

**Extends Set**

Represents a socket owned by a server or a client.

## send

[src/socket-extension-set.js:31-33](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/socket-extension-set.js#L31-L33 "Source code on GitHub")

Transmits a message through the socket.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of the message.
-   `payload` **\[Any]** Payload of the message.

# ServerSideSocket

[src/socket-extension-set.js:16-55](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/socket-extension-set.js#L16-L55 "Source code on GitHub")

**Extends Socket**

Represents a socket owned by a server.

## broadcast

[src/server/server.js:98-110](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/server/server.js#L98-L110 "Source code on GitHub")

Transmits a message to everyone else except for the socket that starts
it.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of the message.
-   `payload` **\[Any]** Payload of the message.
-   `sockets` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[ServerSideSocket](#serversidesocket)>]** Sockets to broadcast the message
    between.

# SocketGroup

[src/server/socket-group.js:5-70](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/server/socket-group.js#L5-L70 "Source code on GitHub")

**Extends Set**

Represents a group of sockets.

## clear

[src/server/socket-group.js:26-38](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/server/socket-group.js#L26-L38 "Source code on GitHub")

Removes all sockets from the group.

## delete

[src/server/socket-group.js:46-52](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/server/socket-group.js#L46-L52 "Source code on GitHub")

Removes the specified socket from the group.

**Parameters**

-   `socket` **[ServerSideSocket](#serversidesocket)** Socket to be removed.

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** `true` if the socket has been removed successfully;
otherwise `false`.

## send

[src/server/socket-group.js:59-69](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/server/socket-group.js#L59-L69 "Source code on GitHub")

Transmits a message to every socket in the group.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of the message.
-   `payload` **\[Any]** Payload of the message.

# SocketExtensionSet

[src/socket-extension-set.js:16-55](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/socket-extension-set.js#L16-L55 "Source code on GitHub")

**Extends Set**

Represents a set of socket extensions.

## apply

[src/socket-extension-set.js:43-54](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/socket-extension-set.js#L43-L54 "Source code on GitHub")

Applies the set of extensions on the given socket.

**Parameters**

-   `socket` **[Socket](#socket)** Socket to apply extensions on.
-   `parent` **([Server](#server) \| [Client](#client))** Parent of the given socket.

Returns **[Socket](#socket)** 

# MessageSerializer

[src/message-serializer.js:5-31](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/message-serializer.js#L5-L31 "Source code on GitHub")

Serializes and deserializes messages transmitted over a WebSocket connection.

## serialize

[src/message-serializer.js:12-18](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/message-serializer.js#L12-L18 "Source code on GitHub")

Serializes a message to be sent over a WebSocket connection.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of the message.
-   `payload` **\[Any]** Payload of the message.

Returns **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Buffer](https://nodejs.org/api/buffer.html) \| [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer))** 

## deserialize

[src/message-serializer.js:25-30](https://github.com/kripod/wsx/blob/bef6447346816a27abdd58811bf69d984d7fa0bb/src/message-serializer.js#L25-L30 "Source code on GitHub")

Deserializes a message received over a WebSocket connection.

**Parameters**

-   `data` **Any** Serialized message data.

Returns **Any** 
