const PostgresTable=require("./PostgresTable");

/**
 * @module
 */

/**
 * A PostgresTable with a much simpler interface.
 * @param {String} name 
 * @param {Object} fields 
 * @param {Array} primaryKeys 
 * 
 * INTERFACE:
 * create: adds a new record/row 
 * read: gets a list of all rows whose properties match those of the json object.
 * If no filter is specified, all rows are returned.
 * 
 * exists: returns true or false depending on wether the 
 * corresponding read would return any row.
 * 
 * update: searches rows according to the first JSON safe object 
 * and modifies the fields of the second argument
 * 
 * delete: deletes all rows matching the JSON object. 
 * If no parameter is passed, deletes all rows.
 * 
 */
function SimpleTable(name,fields,primaryKeys){
    let postgresTable=new PostgresTable(name,fields,primaryKeys);

    this.create=postgresTable.add.bind(postgresTable);
    this.read=postgresTable.get.bind(postgresTable);
    this.exists=function(){
        return postgresTable.exists.apply(postgresTable,arguments);
    }
    this.update=postgresTable.modify.bind(postgresTable);
    this.delete=function(){
        if(arguments.length==0){
            return postgresTable.restart();
        }else{
            return postgresTable.remove.apply(postgresTable,arguments);
        }
    }
    this.count=function(query){
        let copied=Object.assign({},query);
        delete copied._limit;
        return this.read(copied).then((all)=>{
            return all.length;
        })
    }

    this.readOne=function(filter,nonexistent){
        return this.read(filter).then((read)=>{
            if (read.length==0){
                /*
                nonexistent.then=function(){
                    return nonexistent;
                }
                */
                return Promise.resolve(nonexistent);
            }else{
                return Promise.resolve(read[0]);
            }
        });
    }

    this.readQuery=function(query){
        return postgresTable.readQuery(query);
    }
}

module.exports=SimpleTable;