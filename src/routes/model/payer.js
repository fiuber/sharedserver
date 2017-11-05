const serverUrl=process.env.PAYMENT_SERVER;
const fetch=require("node-fetch");


exports.pay=function(paymethod,value){
    console.log("-----------------------------------------");
    console.log(serverUrl);
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    return Promise.resolve(true);
}
exports.paymentMethods=function(){
    return fetch(serverUrl+"/paymethods").then((res)=>{
        return res.json();
    }).then((json)=>{
        return json.items;
    })

}
