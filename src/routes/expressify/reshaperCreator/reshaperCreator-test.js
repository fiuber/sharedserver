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


    it("complex reshape",function(){
        let complexData={
            a:"A",
            b:"B",
            set:{
                c:"1",
                d:"2"
            }
        }

        let reshaped=reshape(function(string,number,array,from){
            return {
                a:string("a"),
                b:string("b"),
                c:from("set",string("c")),
                d:from("set",number("d")),
            };
        },complexData);

        assert.deepEqual(reshaped,{
            a:"A",
            b:"B",
            c:"1",
            d:2
        });
    })

    it("complex array reshape",function(){
        let complexData={
            a:"A",
            b:"B",
            data:[
                {name:"Pedro",age:12,pets:[]},
                {name:"Mateo",age:17,pets:["dog"]},
                {name:"Pablo",age:25,pets:["dog","cat"]}
            ]
        }

        let reshaped=reshape(function(string,number,array,from){
            return from("data",array({
                name:string("name"),
                pets:from("pets")
            }))
        },complexData)

        assert.includeDeepMembers(reshaped,[
            {name:"Pedro",pets:[]},
            {name:"Mateo",pets:["dog"]},
            {name:"Pablo",pets:["dog","cat"]},
        ]);
    })
})