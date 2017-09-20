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
    let withTypes=this.fileds.map((t)=>t+" "+this.types[t]);

    let withPrimary=this.fields.map((wt)=>{
        if(this.primaryKeys.includes(wt)){
            return wt + " primary key"
        }else{
            return wt;
        }
    });

    let joined=withPrimary.join(",");

    return "create table "+this.name+"("+joined+");";
}

QueryBuilder.prototype.insert=function(){

    let notSerial=(f)=>{
        let type=this.types[f];
        return ! (type.replace(" ","")==="serial")
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
    let ret="select * from "+this.name
    ret.where=(partialRow)=>{
        return ret+" "+this.where(partialRow);
    }
    return ret;
}

QueryBuilder.prototype.numberedFields=function(partialRow,offset){
    if(offset==undefined){
        offset=0
    }

    let presentFields=this.fields.filter((field)=>{
        return Object.keys(partialRow).includes(field)
    });

    let equalities=[]
    for(let i; i<presentFields.length;i++){
        let equality=presentFields[i]+"=$"+(i+1+offset);
        equalities.push(equality);
    }
    let condition = equalities.join(", ");
    condition.fields=presentFields;

    return condition;

}

QueryBuilder.prototype.where=function(partialRow,offset){

    return "where "+this.numberedFields(partialRow,offset);
}

QueryBuilder.prototype.update=function(partialRowUpdate){
    let numbered=this.numberedFields(partialRowUpdate);
    let ret="update "+this.name+" set "+numbered;
    ret.where=(partialRow)=>{
        return ret+" "+this.where(partialRow,numbered.fields.length)
    }
    return ret;
}

QueryBuilder.prototype.delete=function(){
    let ret="delete from "+this.name;
    ret.where=(partialRow)=>{
        return ret + " "+this.where(partialRow);
    }
    return ret;
}