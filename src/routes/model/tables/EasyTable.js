const SimpleTable=require("./SimpleTable")

/**
 * A SimpleTable that is easy to use.
 * @param {String} name 
 * @param {Object} fields 
 * @param {Array} primaryKeys 
 */
function EasyTable(name,fields,primaryKeys){
    let simpleTable=new SimpleTable(name,fields,primariKeys);
    let fixedCaps=new CapsKeeper(simpleTable,Object.keys(fields));
    FastPromiser.call(this,fixedCaps);
}