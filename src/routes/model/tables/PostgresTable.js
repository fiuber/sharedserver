const db=require("./localdatabase").db;
const QueryBuilder=require("./QueryBuilder");
const log=require("debug")("fiuber:low:PostgresTable");
const error=require("debug")("fiuber:error:PostgresTable");

/**
 * @module 
 */
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
}
PostgresTable.prototype=Object.create(QueryBuilder.prototype);
PostgresTable.prototype.constructor=PostgresTable;

/**
 * @method rowToArray
 * @description Transforms the row in an Array that can be used to call pg-promise
 * @param {Object} row row to be transformed
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
 * @method restart
 * @description Drops the PostgresTable and empties it
 */
PostgresTable.prototype.restart=function(){
    return db.none(this.drop()).then(()=>db.none(this.create())).then(()=>{
        log(this.drop(),this.create());
    }).catch((e)=>{
        error(e,this.drop(),this.create());
        return Promise.reject(e);
    })
}
/**
 * @method add
 * @description Adds a row.
 * @param {Object} row
 */
PostgresTable.prototype.add=function(row){
    return db.one(this.insert(),this.rowToArray(row).noSerials()).catch((e)=>{
        
        return Promise.reject({error:e,in:this.insert()});
    }).then((e)=>{
        log(this.insert(),this.rowToArray(row).noSerials());
        return Promise.resolve(e);
    }).catch((e)=>{
        error(e,this.insert(),this.rowToArray(row).noSerials());
        return Promise.reject(e);
    })
}

/**
 * @method get
 * @description Finds the row by checking equality the properties and values of the passed object
 * @param {Object} partialRow filter by equality against this Object
 */
PostgresTable.prototype.get=function(partialRow){
    let select=this.select();
    if(partialRow){
        return db.any(select.where(partialRow),this.rowToArray(partialRow)).then((e)=>{
            log(select.where(partialRow),this.rowToArray(partialRow));
            return e;
        }).catch((e)=>{
            error(e,select.where(partialRow),this.rowToArray(partialRow));
            return Promise.reject(e);
        })
    }else{
        return db.any(select.all()).then((e)=>{
            log(select.all());
            return e;
        }).catch((e)=>{
            error(e,select.all());
            return Promise.reject(e);
        });
    }
    
}

/**
 * @method exists
 * @description Finds the row by checking equality the properties and values of the passed object
 * @param {Object} partialRow
 */
PostgresTable.prototype.exists=function(partialRow){
    return db
    .any(this.select().where(partialRow),this.rowToArray(partialRow))
    .then(function(data){return data.length>0})
    .then((e)=>{
        log("exists:",e);
        return e;
    }).catch((e)=>{
        error(e,this.select().where(partialRow),this.rowToArray(partialRow));
        return Promise.reject(e);
    });
}

/**
 * @method modify
 * @description Finds the row by checking equality the properties and values of the passed partialRowSelection,
 * sets the values of the row to be partialRowUpdate
 * @param {Object} partialRowSelection A selection row
 * @param {Object} partialRowUpdate A row that says how that row will be modified
 */

PostgresTable.prototype.modify=function(partialRowSelection,partialRowUpdate){
    let array = this.rowToArray(partialRowUpdate).concat(this.rowToArray(partialRowSelection))
    return db
    .none(this.update(partialRowUpdate).where(partialRowSelection),array).then((e)=>{
        log(this.update(partialRowUpdate).where(partialRowSelection),array);
        return e;
    }).catch((e)=>{
        error(e,this.update(partialRowUpdate).where(partialRowSelection),array);
        return Promise.reject(e);
    });
}

/**
 * @method remove
 * @description Removes all matching rows
 * @param {Object} partialRowSelection filter
 */

PostgresTable.prototype.remove=function(partialRowSelection){
    return db
    .none(this.delete().where(partialRowSelection),this.rowToArray(partialRowSelection))
    .then((e)=>{
        log(this.delete().where(partialRowSelection),this.rowToArray(partialRowSelection));
        return e;
    }).catch((e)=>{
        error(e,this.delete().where(partialRowSelection),this.rowToArray(partialRowSelection));
        return Promise.reject(e);
    });
}


module.exports=PostgresTable;