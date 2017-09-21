let assert=require("chai").assert;
const CapsKeeper=require("./CapsKeeper");

describe("CapsKeeper keeps caps",function(){
    let wrapMeOne=function(){
        return {
            tEsT:15,
            oop:0,
            lOp:7,
            queryMe:true
        }
    }

    let wrapMeSome=function(){
        return [{tEsT:15},{oop:0},{lOp:7},{queryMe:true}]
    }
    let wrapMeNot=function(){
        return "tEsT"
    }
    let object={
        wOne:wrapMeOne,
        not:wrapMeNot,
        wSome:wrapMeSome
    }
    let wrappedObject=new CapsKeeper(object,["test","Oop","LOP"])
    it("caps are kept for one JSON safe object",function(){
        return wrappedObject.wOne().then((res)=>{
            assert.deepEqual(res,{
                test:15,
                Oop:0,
                LOP:7,
                queryMe:true
            });
        })
    })

    it("caps are kept for an array of JSON safe objects",function(){
        return wrappedObject.wSome().then((res)=>{
            assert.deepEqual(res,[
                {test:15},
                {Oop:0},
                {LOP:7},
                {queryMe:true}
            ]);
        })
    })

    it("simple objects are untouched",function(){
        return wrappedObject.not().then((res)=>{
            assert.equal(res,"tEsT");
        })
    })
});