const serverUrl=process.env.PAYMENT_SERVER;
const fetch=require("node-fetch");
const request=require("superagent");
let credentials=null;

function updateCredentials(){
    if(serverUrl.includes("json-server")){
        credentials={
            token_type:"bearer",
            access_token:"asdddd"
        }
        return Promise.resolve(true);
    }else{
        return request
        .post(serverUrl+"/user/oauth/authorize")
        .send({
            "client_id": "e603dd18-b397-4f05-bce8-bd2eea037530",
            "client_secret": "348560ad-05a3-4f01-b9dd-c157a956aa8c"
        }).then((res)=>{
            credentials=res.body;
            console.log("Las credntials las tengoooooooooo")
            console.log(credentials);
        })
    }
}

exports.pay=function(paymethod,value){
    return updateCredentials().then(()=>{
        let o=paymethod.parameters;
        o.method=paymethod.paymethod;
        return request
        .post(serverUrl+"/payments")
        //.set("Authorize",credentials.token_type+" "+credentials.access_token)
        .set("Authorization","bearer "+credentials.access_token)
        .send({
            transaction_id:1,
            currency:"ARS",
            value:value,
            paymentMethod:o
        })
        /*
        .catch((e)=>{
            console.log(e)
            console.log("2222222222222222222222222222222222222222222")
            console.log(e.response.res.text)
            console.log({
                transaction_id:1,
                currency:"ARS",
                value:value,
                paymentMethod:o
            });
        })
        */
    }).then((res)=>{
        if(res.status!=201){
            return Promise.reject("The payment on the external API was unsuccessful");
        }
    })

}
exports.paymentMethods=function(){
    return request.get(serverUrl+"/paymethods").then((res)=>{
        return res.body.items;
    })
}