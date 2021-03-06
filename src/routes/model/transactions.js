const transactions=require("./tables").transactions;

/**
 * @module
 * @description Model for handling the transactions CRUD
 */

exports.getTransactions=function(userId,nonexistent){
    return transactions.read({userId:userId});
}

let payer={
    pay:function(payMethod,value){
        return Promise.resolve(true);
    }
};
exports.setPayer=function(newPayer){
    payer=newPayer;
}

exports.addTransaction=function(body,userId,nonexistent){
    //entra un Transaction
    //y en data tiene que haber un PayMethod

    return payer.pay(body.data,body.cost.value).then(()=>{
        return transactions.create({
            userId:userId,
            tripId:body.trip,
            timestamp:(new Date()).getTime(),
            costCurrency:body.cost.currency,
            costValue:body.cost.value,
            description:body.description,
            data:JSON.stringify(body.data)
        }).then((added)=>{
            added.data=JSON.parse(added.data);
            return added;
        })
    })
}
exports.addTransaction.shape={
    id:"string",
    trip:"string",
    timestamp:0,
    cost:{
        currency:"string",
        value:0
    },
    description:"string",
    data:{}
};

exports.addDebt=function(body,userId,nonexistent){
    //entra un Transaction
    //y en data tiene que haber un PayMethod
    
    return transactions.create({
        userId:userId,
        tripId:body.trip,
        timestamp:(new Date()).getTime(),
        costCurrency:body.cost.currency,
        costValue:body.cost.value,
        description:body.description,
        data:JSON.stringify(body.data)
    }).then((added)=>{
        added.data=JSON.parse(added.data);
        return added;
    })
    
}

exports.getBalance=function(userId){
    return exports.getTransactions(userId,"nonexistent")
    .then((transactions)=>{
        return transactions.map((t)=>{
            return {currency:t.costCurrency,value:t.costValue}
        })
    }).then((costs)=>{
        let o={};
        for(let cost of costs){
            o[cost.currency] =0;
        }
        for(let cost of costs){
            o[cost.currency]+=(new Number(cost.value)).valueOf();
        }
        
        return Object.keys(o).map((k)=>{
            return {value:o[k],currency:k};
        })
    })
}