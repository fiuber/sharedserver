const assert=require("chai").assert;
const reshape=require("./reshaperCreator").reshape;

describe("Using reshape",function(){
    let simpleData={
        first:"1",
        second:2,
        userAge:15,
        userName:"Gonzalez Gerardo"
    }

    let lotsOfData=[
        {times:1,name:"gonzalez"},
        {times:5,name:"superfluo"},
        {times:85,name:"chavon"},
    ]

    it("Simple reshape",function(){
        let reshaped=reshape(function(string,number){
            return {
                stats:{
                    first:number("first"),
                    second:number("second"),
                    user:{
                        userAge:string("userAge"),
                        userName:string("userName")
                    }
                },
                meta:"v1",
                version:1
            }
        },simpleData)

        assert.isNumber(reshaped.stats.first);
        assert.isString(reshaped.stats.user.userAge);

        assert.deepEqual(reshaped,{
            stats:{
                first:1,
                second:2,
                user:{
                    userAge:"15",
                    userName:"Gonzalez Gerardo"
                }
            },
            meta:"v1",
            version:1
        })
    })

    it("array reshape",function(){
        let reshaped=reshape(function(string,number,array){
            return {
                data:array({
                    times:string("times"),
                    name:string("name")
                }),
                meta:"v1",
                version:1
            }
        },lotsOfData)

        assert.equal(reshaped.meta,"v1");
        assert.equal(reshaped.version,1);
        assert.equal(reshaped.data.length,3);

        assert.deepEqual(reshaped.data[0],{times:"1",name:"gonzalez"});
        assert.deepEqual(reshaped.data[1],{times:"5",name:"superfluo"});
        assert.deepEqual(reshaped.data[2],{times:"85",name:"chavon"});

    })
})