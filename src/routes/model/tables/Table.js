
/**
 * Creates a new table object, so it's 
 * not necessary to write queries everywhere
 * @param {String} name the name of the table
 * @param {Object} fields An Object containing the fields as keys and the
 *  types as values. The order is inferred from this map
 * @param {Array} primaryKeys An array of primarykeys
 */
function Table(name,fields,primaryKeys){
    QueryBuilder.call(this,name,fields,primaryKeys)
    /*
    this.name=name;
    this.fields=Object.keys(fields);
    this.types=fields;
    this.primaryKeys=primaryKeys;
    */
}

//TODO: LO DE LAS MAYUSCULAS: CUANDO SALIS DE SQL VIENE TODO EN MINUSCULA!!!

/**
 * Drops the table and empties it
 */
Table.prototype.restart=function(){
    return db.none(this.drop()).then(()=>db.none(this.create()))
}

/**
 * Adds a row.
 */
Table.prototype.add=function(row){
    return db.one(this.insert(),this.rowToArray(row).noSerials())
}

/**
 * Finds the row by checking equality the properties and values of the passed object
 */
Table.prototype.exists=function(partialRow){
    return db
    .any(this.select().where(partialRow),this.rowToArray(partialRow))
    .then(function(data){return data.length>0})
}

/**
 * Finds the row by checking equality the properties and values of the passed partialRowSelection,
 * sets the values of the row to be partialRowUpdate
 */

Table.prototype.update=function(partialRowSelection,partialRowUpdate){
    let array = this.rowToArray(partialRowUpdate).concat(this.rowToArray(partialRowSelection))
    return db
    .none(this.update(partialRowUpdate).where(partialRowSelection),array)
}

Table.prototype.delete=function(partialRowSelection){
    return db
    .none(this.delete().where(partialRowSelection),this.rowToArray(partialRowSelection))
}

Table.prototype.list=function(){
    return db.any(this.select())
}
