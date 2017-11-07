## Modules

<dl>
<dt><a href="#module_auth">auth</a></dt>
<dd></dd>
<dt><a href="#model.module_servers">servers</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#expressify">expressify(shape, metadata, fun)</a></dt>
<dd><p>Decouples apify.js and express.</p>
</dd>
<dt><a href="#PostgresTable">PostgresTable(name, fields, primaryKeys)</a></dt>
<dd><p>Creates a new PostgresTable object, so it&#39;s 
not necessary to write queries everywhere</p>
</dd>
<dt><a href="#FastPromiser">FastPromiser(obj)</a></dt>
<dd><p>Overloads the interface of any object so 
it returns a custom promise, that allows for simpler calls</p>
</dd>
<dt><a href="#SimpleTable">SimpleTable(name, fields, primaryKeys)</a></dt>
<dd><p>A PostgresTable with a much simpler interface.</p>
</dd>
<dt><a href="#QueryBuilder">QueryBuilder(name, fields, primaryKeys)</a></dt>
<dd><p>Builds queries. Determines the order of the columns.</p>
</dd>
<dt><a href="#EasyTable">EasyTable(name, fields, primaryKeys)</a></dt>
<dd><p>A SimpleTable that is easy to use.</p>
</dd>
</dl>

<a name="module_auth"></a>

## auth
<a name="module_auth.middleware"></a>

### auth.middleware()
A middleware generator function. 
It allows access if at least one of the provided authenticators
returns true or a promise that resolves to true.

Authenticators take an "authdata" object wich contains the token from the header
and the username, in case the header has the form user:hash. They also take
an "identify" functions wich takes an identification of the client. Wathever 
object this function takes is the "me" object in calls to the next apify-wrapped middleware.

**Kind**: static method of [<code>auth</code>](#module_auth)  

| Param | Description |
| --- | --- |
| ... | A list of authenticators |

<a name="model.module_servers"></a>

## servers

* [servers](#model.module_servers)
    * [.ping()](#model.module_servers.ping)
    * [.update()](#model.module_servers.update)
    * [.list()](#model.module_servers.list)
    * [.authorized(credentials, identifyAs)](#model.module_servers.authorized)

<a name="model.module_servers.ping"></a>

### servers.ping()
No se agrega porque no se sabe cuál es el server 
que me está pegando porque no están implementadas las autorizaciones

**Kind**: static method of [<code>servers</code>](#model.module_servers)  
<a name="model.module_servers.update"></a>

### servers.update()
Updates only the name of the server with the received ID

**Kind**: static method of [<code>servers</code>](#model.module_servers)  
<a name="model.module_servers.list"></a>

### servers.list()
no pongo el METADATA correspondiente porque no entiendo qué significa

**Kind**: static method of [<code>servers</code>](#model.module_servers)  
<a name="model.module_servers.authorized"></a>

### servers.authorized(credentials, identifyAs)
determines wether the client is authorized.

**Kind**: static method of [<code>servers</code>](#model.module_servers)  

| Param | Description |
| --- | --- |
| credentials | an object containing a "token" property |
| identifyAs | a function that takes an object that identifies the client |

<a name="expressify"></a>

## expressify(shape, metadata, fun)
Decouples apify.js and express.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| shape | <code>shape</code> | an object representing the  shape of the json objects accepted |
| metadata | <code>object</code> | an object that will be inserted  in the successful response under the "metadata"  property |
| fun | <code>fn</code> | the function to expressify |

<a name="PostgresTable"></a>

## PostgresTable(name, fields, primaryKeys)
Creates a new PostgresTable object, so it's 
not necessary to write queries everywhere

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the name of the PostgresTable |
| fields | <code>Object</code> | An Object containing the fields as keys and the  types as values. The order is inferred from this map |
| primaryKeys | <code>Array</code> | An array of primarykeys |


* [PostgresTable(name, fields, primaryKeys)](#PostgresTable)
    * [.rowToArray()](#PostgresTable+rowToArray)
    * [.restart()](#PostgresTable+restart)
    * [.add()](#PostgresTable+add)
    * [.get()](#PostgresTable+get)
    * [.exists()](#PostgresTable+exists)
    * [.modify()](#PostgresTable+modify)

<a name="PostgresTable+rowToArray"></a>

### postgresTable.rowToArray()
Transforms the row in an Array that can be used to call pg-promise

**Kind**: instance method of [<code>PostgresTable</code>](#PostgresTable)  
<a name="PostgresTable+restart"></a>

### postgresTable.restart()
Drops the PostgresTable and empties it

**Kind**: instance method of [<code>PostgresTable</code>](#PostgresTable)  
<a name="PostgresTable+add"></a>

### postgresTable.add()
Adds a row.

**Kind**: instance method of [<code>PostgresTable</code>](#PostgresTable)  
<a name="PostgresTable+get"></a>

### postgresTable.get()
Finds the row by checking equality the properties and values of the passed object

**Kind**: instance method of [<code>PostgresTable</code>](#PostgresTable)  
<a name="PostgresTable+exists"></a>

### postgresTable.exists()
Finds the row by checking equality the properties and values of the passed object

**Kind**: instance method of [<code>PostgresTable</code>](#PostgresTable)  
<a name="PostgresTable+modify"></a>

### postgresTable.modify()
Finds the row by checking equality the properties and values of the passed partialRowSelection,
sets the values of the row to be partialRowUpdate

**Kind**: instance method of [<code>PostgresTable</code>](#PostgresTable)  
<a name="FastPromiser"></a>

## FastPromiser(obj)
Overloads the interface of any object so 
it returns a custom promise, that allows for simpler calls

**Kind**: global function  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

<a name="SimpleTable"></a>

## SimpleTable(name, fields, primaryKeys)
A PostgresTable with a much simpler interface.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> |  |
| fields | <code>Object</code> |  |
| primaryKeys | <code>Array</code> | INTERFACE: create: adds a new record/row  read: gets a list of all rows whose properties match those of the json object. If no filter is specified, all rows are returned. exists: returns true or false depending on wether the  corresponding read would return any row. update: searches rows according to the first JSON safe object  and modifies the fields of the second argument delete: deletes all rows matching the JSON object.  If no parameter is passed, deletes all rows. |

<a name="QueryBuilder"></a>

## QueryBuilder(name, fields, primaryKeys)
Builds queries. Determines the order of the columns.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the name of the table |
| fields | <code>Object</code> | An Object containing the fields as keys and the  types as values. The order is inferred from this map |
| primaryKeys | <code>Array</code> | An array of primarykeys |

<a name="EasyTable"></a>

## EasyTable(name, fields, primaryKeys)
A SimpleTable that is easy to use.

**Kind**: global function  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 
| fields | <code>Object</code> | 
| primaryKeys | <code>Array</code> | 

