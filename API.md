# Server

[src/server/server.js:11-164](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/server/server.js#L11-L164 "Source code on GitHub")

**Extends EventEmitter**

WebSocket server with extensions.

## socketExtensions

[src/server/server.js:55-55](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/server/server.js#L55-L55 "Source code on GitHub")

Socket extensions to be applied on every managed socket.

## messageSerializer

[src/server/server.js:61-61](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/server/server.js#L61-L61 "Source code on GitHub")

Message serializer instance.

## sockets

[src/server/server.js:67-67](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/server/server.js#L67-L67 "Source code on GitHub")

Store for every connected socket.

## constructor

[src/server/server.js:84-149](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/server/server.js#L84-L149 "Source code on GitHub")

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Options to construct the server with. Every option
    is passed to the underlying WebSocket server implementation.
    -   `options.plugins` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)>]** Plugins to be used, each defined
        as a function taking the constructed server instance as a parameter.
-   `successCallback` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Function to be executed on successful
    initialization.

## getSocketGroup

[src/server/server.js:156-163](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/server/server.js#L156-L163 "Source code on GitHub")

Retrieves a socket group by its ID. Creates a new group if necessary.

**Parameters**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** ID of the group.

Returns **Group** 

## connect

[src/server/server.js:49-49](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/server/server.js#L49-L49 "Source code on GitHub")

Connection event, fired when a socket has connected successfully.

**Parameters**

-   `socket` **[ServerSideSocket](#serversidesocket)** Connected socket instance.

## message:\[type]

[src/server/server.js:49-49](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/server/server.js#L49-L49 "Source code on GitHub")

Message event, fired when a typeful message is received.

**Parameters**

-   `socket` **[ServerSideSocket](#serversidesocket)** Socket of the message's sender.
-   `payload` **Any** Payload of the message.

## disconnect

[src/server/server.js:49-49](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/server/server.js#L49-L49 "Source code on GitHub")

Disconnection event, fired when a socket disconnects.

**Parameters**

-   `socket` **[ServerSideSocket](#serversidesocket)** Disconnected socket instance.
-   `code` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Close status code sent by the socket.
-   `reason` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Reason why the socket closed the connection.

## error

[src/server/server.js:49-49](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/server/server.js#L49-L49 "Source code on GitHub")

Error event, fired when an unexpected error occurs.

**Parameters**

-   `error` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Error object.
-   `socket` **\[[ServerSideSocket](#serversidesocket)]** Socket which caused the error.

# Client

[src/client/client.js:10-120](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/client/client.js#L10-L120 "Source code on GitHub")

**Extends EventEmitter**

WebSocket client with extensions.

## socketExtensions

[src/client/client.js:51-51](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/client/client.js#L51-L51 "Source code on GitHub")

Socket extensions to be applied on every managed socket.

## messageSerializer

[src/client/client.js:57-57](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/client/client.js#L57-L57 "Source code on GitHub")

Message serializer instance.

## constructor

[src/client/client.js:66-98](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/client/client.js#L66-L98 "Source code on GitHub")

**Parameters**

-   `url` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** URL of the WebSocket server to which to connect.
-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Options to construct the client with.
    -   `options.protocols` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>]** Protocols to be used if possible.
    -   `options.plugins` **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)>]** Plugins to be used, each defined
        as a function taking the constructed client instance as a parameter.

## send

[src/client/client.js:105-107](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/client/client.js#L105-L107 "Source code on GitHub")

Transmits a message to the server.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of the message.
-   `payload` **\[Any]** Payload of the message.

## disconnect

[src/client/client.js:117-119](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/client/client.js#L117-L119 "Source code on GitHub")

Closes the connection or connection attempt, if any.

**Parameters**

-   `code` **\[[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)]** Status code explaining why the connection is being
    closed.
-   `reason` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** A human-readable string explaining why the
    connection is closing. This string must be no longer than 123 bytes of
    UTF-8 text (not characters).

## error

[src/client/client.js:45-45](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/client/client.js#L45-L45 "Source code on GitHub")

Error event, fired when an unexpected error occurs.

## message:\[type]

[src/client/client.js:45-45](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/client/client.js#L45-L45 "Source code on GitHub")

Message event, fired when a typeful message is received.

**Parameters**

-   `payload` **Any** Payload of the message.

## disconnect

[src/client/client.js:45-45](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/client/client.js#L45-L45 "Source code on GitHub")

Disconnection event, fired when the socket disconnects.

**Parameters**

-   `code` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Close status code sent by the server.
-   `reason` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Reason why the server closed the connection.
-   `wasClean` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Indicates whether or not the connection was
    cleanly closed.

## connect

[src/client/client.js:45-45](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/client/client.js#L45-L45 "Source code on GitHub")

Connection event, fired when the socket has connected successfully.

# Socket

[src/socket-extension-set.js:16-58](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/socket-extension-set.js#L16-L58 "Source code on GitHub")

**Extends Set**

Represents a socket owned by a server or a client.

## send

[src/socket-extension-set.js:34-36](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/socket-extension-set.js#L34-L36 "Source code on GitHub")

Transmits a message through the socket.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of the message.
-   `payload` **\[Any]** Payload of the message.

# ServerSideSocket

[src/socket-extension-set.js:16-58](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/socket-extension-set.js#L16-L58 "Source code on GitHub")

**Extends Socket**

Represents a socket owned by a server.

## broadcast

[src/server/server.js:98-104](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/server/server.js#L98-L104 "Source code on GitHub")

Transmits a message to everyone else except for the socket that starts
it.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of the message.
-   `payload` **\[Any]** Payload of the message.

# SocketGroup

[src/server/socket-group.js:5-64](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/server/socket-group.js#L5-L64 "Source code on GitHub")

**Extends Set**

Represents a group of sockets.

## clear

[src/server/socket-group.js:26-38](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/server/socket-group.js#L26-L38 "Source code on GitHub")

Removes all sockets from the group.

## delete

[src/server/socket-group.js:46-52](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/server/socket-group.js#L46-L52 "Source code on GitHub")

Removes the specified socket from the group.

**Parameters**

-   `socket` **[ServerSideSocket](#serversidesocket)** Socket to be removed.

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** `true` if the socket has been removed successfully;
otherwise `false`.

## send

[src/server/socket-group.js:59-63](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/server/socket-group.js#L59-L63 "Source code on GitHub")

Transmits a message to every socket in the group.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of the message.
-   `payload` **\[Any]** Payload of the message.

# SocketExtensionSet

[src/socket-extension-set.js:16-58](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/socket-extension-set.js#L16-L58 "Source code on GitHub")

**Extends Set**

Represents a set of socket extensions.

## constructor

[src/socket-extension-set.js:20-38](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/socket-extension-set.js#L20-L38 "Source code on GitHub")

**Parameters**

-   `iterable` **\[Any]** Elements to be initially added to the set.

## apply

[src/socket-extension-set.js:46-57](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/socket-extension-set.js#L46-L57 "Source code on GitHub")

Applies the set of extensions on the given socket.

**Parameters**

-   `socket` **[Socket](#socket)** Socket to apply extensions on.
-   `parent` **([Server](#server) \| [Client](#client))** Parent of the given socket.

Returns **[Socket](#socket)** 

# MessageSerializer

[src/message-serializer.js:5-31](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/message-serializer.js#L5-L31 "Source code on GitHub")

Serializes and deserializes messages transmitted over a WebSocket connection.

## serialize

[src/message-serializer.js:12-18](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/message-serializer.js#L12-L18 "Source code on GitHub")

Serializes a message to be sent over a WebSocket connection.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Type of the message.
-   `payload` **\[Any]** Payload of the message.

Returns **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Buffer](https://nodejs.org/api/buffer.html) \| [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer))** 

## deserialize

[src/message-serializer.js:25-30](https://github.com/kripod/wsx/blob/259063bdf207d7ad5aa1b0ecda459e253aa5566a/src/message-serializer.js#L25-L30 "Source code on GitHub")

Deserializes a message received over a WebSocket connection.

**Parameters**

-   `data` **Any** Serialized message data.

Returns **Any** 
