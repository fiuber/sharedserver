const db=require("./localdatabase").db;
const QueryBuilder=require("./QueryBuilder");
/**
 * Creates a new PostgresTable object, so it's 
 * not necessary to write queries everywhere
 * @param {String} name the name of the PostgresTable
 * @param {Object} fields An Object containing the fields as keys and the
 *  types as values. The order is inferred from this map
 * @param {Array} primaryKeys An array of primarykeys
 */
function PostgresTable(name,fields,primaryKeys){
    QueryBuilder.call(this,name,fields,primaryKeys)
    /*
    this.name=name;
    this.fields=Object.keys(fields);
    this.types=fields;
    this.primaryKeys=primaryKeys;
    */
}
PostgresTable.prototype=Object.create(QueryBuilder.prototype);
PostgresTable.prototype.constructor=PostgresTable;
//TODO: LO DE LAS MAYUSCULAS: CUANDO SALIS DE SQL VIENE TODO EN MINUSCULA!!!

/**
 * Transforms the row in an Array that can be used to call pg-promise
 */
PostgresTable.prototype.rowToArray=function(row){
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
 * Drops the PostgresTable and empties it
 */
PostgresTable.prototype.restart=function(){
    return db.none(this.drop()).then(()=>db.none(this.create()))
}

/**
 * Adds a row.
 */
PostgresTable.prototype.add=function(row){
    return db.one(this.insert(),this.rowToArray(row).noSerials())
}

/**
 * Finds the row by checking equality the properties and values of the passed object
 */
PostgresTable.prototype.get=function(partialRow){
    let select=this.select();
    if(partialRow){
        return db.any(select.where(partialRow),this.rowToArray(partialRow));
    }else{
        return db.any(select.all());
    }
    
}

/**
 * Finds the row by checking equality the properties and values of the passed object
 */
PostgresTable.prototype.exists=function(partialRow){
    return db
    .any(this.select().where(partialRow),this.rowToArray(partialRow))
    .then(function(data){return data.length>0})
}

/**
 * Finds the row by checking equality the properties and values of the passed partialRowSelection,
 * sets the values of the row to be partialRowUpdate
 */

PostgresTable.prototype.modify=function(partialRowSelection,partialRowUpdate){
    let array = this.rowToArray(partialRowUpdate).concat(this.rowToArray(partialRowSelection))
    return db
    .none(this.update(partialRowUpdate).where(partialRowSelection),array)
}

PostgresTable.prototype.remove=function(partialRowSelection){
    return db
    .none(this.delete().where(partialRowSelection),this.rowToArray(partialRowSelection))
}


module.exports=PostgresTable;