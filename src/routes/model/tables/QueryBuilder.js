/**
 * Builds queries. Determines the order of the columns.
 * @param {String} name the name of the table
 * @param {Object} fields An Object containing the fields as keys and the
 *  types as values. The order is inferred from this map
 * @param {Array} primaryKeys An array of primarykeys
 */
function QueryBuilder(name,fields,primaryKeys){
    this.name=name;
    this.fields=Object.keys(fields);
    this.types=fields;
    this.primaryKeys=primaryKeys;
}

QueryBuilder.prototype.drop=function(){
    return "drop table if exists "+this.name+" cascade";
}

QueryBuilder.prototype.create=function(){
    let prepared=this.fields.map((t)=>{
        if(this.primaryKeys.includes(t)){
            return t+" "+this.types[t]+" primary key";
        }else{
            return t+" "+this.types[t];
        }
    })

    let joined=prepared.join(",");

    return "create table "+this.name+"("+joined+");";
}

QueryBuilder.prototype.isSerial=function(field){
    let type=this.types[field];
    return (type.replace(" ","")==="serial")
}

QueryBuilder.prototype.insert=function(){

    let notSerial=(f)=>{
        return ! this.isSerial(f);
    }

    let withoutSerials=this.fields.filter(notSerial);
    let joined=withoutSerials.join(",");
    let insertPart="insert into "+this.name+"("+joined+")";

    let values=[];
    for(let i=0; i<withoutSerials.length;i++){
        values.push("$"+(i+1));
    }

    let valuesPart="values("+values.join(",")+")";

    //everything is returned
    let returningPart="returning "+this.fields.join(",");

    return insertPart+" "+valuesPart+" "+returningPart;
}

QueryBuilder.prototype.select=function(){
    let partial="select * from "+this.name;
    let ret=new String(partial+";");
    ret.where=(partialRow)=>{
        return partial+" "+this.where(partialRow);
    }
    ret.all=()=>{
        return partial+";";
    }
    return ret;
}

QueryBuilder.prototype.numberedFields=function(partialRow,offset,separator){
    if(offset==undefined){
        offset=0
    }

    let presentFields=this.fields.filter((field)=>{
        return Object.keys(partialRow).includes(field)
    });

    let equalities=[]
    for(let i=0; i<presentFields.length;i++){
        
        let equality=presentFields[i]+"=$"+(i+1+offset);

        equalities.push(equality);
    }

    separator =separator || ", ";

    let condition = new String(equalities.join(separator));
    condition.fields=presentFields;

    return condition;
}

QueryBuilder.prototype.where=function(partialRow,offset){

    return "where "+this.numberedFields(partialRow,offset," and ");
}

QueryBuilder.prototype.update=function(partialRowUpdate){
    let numbered=this.numberedFields(partialRowUpdate);
    let ret=new String("update "+this.name+" set "+numbered);
    ret.where=(partialRow)=>{
        return ret+" "+this.where(partialRow,numbered.fields.length)
    }
    return ret;
}

QueryBuilder.prototype.delete=function(){
    let ret=new String("delete from "+this.name);
    ret.where=(partialRow)=>{
        return ret + " "+this.where(partialRow);
    }
    return ret;
}

module.exports=QueryBuilder;