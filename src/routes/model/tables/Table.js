const db=require("./localdatabase").db;
const QueryBuilder=require("./QueryBuilder");
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
Table.prototype=Object.create(QueryBuilder.prototype);
Table.prototype.constructor=Table;
//TODO: LO DE LAS MAYUSCULAS: CUANDO SALIS DE SQL VIENE TODO EN MINUSCULA!!!

/**
 * Transforms the row in an Array that can be used to call pg-promise
 */
Table.prototype.rowToArray=function(row){
    let ordered=this.fields.filter((f)=>{
        return Object.keys(row).includes(f)
    });
    let values=ordered.map((field)=>row[field]);
    values.noSerials=()=>{
        let filteredAndOrdered=ordered.filter((field)=>{
            return ! this.isSerial(field);
        });
        return filteredAndOrdered.map((field)=>row[field]);
    }
    return values;
}

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
Table.prototype.get=function(partialRow){
    return db
    .any(this.select().where(partialRow),this.rowToArray(partialRow));
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

Table.prototype.modify=function(partialRowSelection,partialRowUpdate){
    let array = this.rowToArray(partialRowUpdate).concat(this.rowToArray(partialRowSelection))
    return db
    .none(this.update(partialRowUpdate).where(partialRowSelection),array)
}

Table.prototype.remove=function(partialRowSelection){
    return db
    .none(this.delete().where(partialRowSelection),this.rowToArray(partialRowSelection))
}

Table.prototype.list=function(){
    return db.any(this.select().simple());
}


module.exports=Table;