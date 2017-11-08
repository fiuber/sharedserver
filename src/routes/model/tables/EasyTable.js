const SimpleTable=require("./SimpleTable");
const CapsKeeper=require("./CapsKeeper");
const FastPromiser=require("./FastPromiser");
/**
 * @module 
 * @description A SimpleTable that is easy to use.
 */

/**
 * A SimpleTable that is easy to use.
 * @param {String} name 
 * @param {Object} fields 
 * @param {Array} primaryKeys 
 */
function EasyTable(name,fields,primaryKeys){
    let simpleTable=new SimpleTable(name,fields,primaryKeys);
    let fixedCaps=new CapsKeeper(simpleTable,Object.keys(fields));
    FastPromiser.call(this,fixedCaps);
}

module.exports=EasyTable;