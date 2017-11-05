exports.addTransaction=function(string,number,array,from){
    return {
        transaction:{
            id:string("id"),
            trip:string("tripId"),
            timestamp:number("timestamp"),
            cost:{
                currency:string("costCurrency"),
                value:number("costValue")
            },
            description:string("description"),
            data:from("data")
        }
    }
}

exports.getTransactions=function(string,number,array,from){
    let transaction=exports.addTransaction(string,number,array,from).transaction;
    return {
        transactions:array(transaction)
    }
}