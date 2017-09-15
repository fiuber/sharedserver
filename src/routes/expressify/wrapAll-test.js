let assert=require("chai").assert;
let wrapAll=require("./wrapAll.js");

describe("wrapAll",function(){
    function wrapper3(f){
        return 3;
    }
    function wrapperDouble(f){
        f()
        f()
    }
    function s(a,b){
        return a+b;
    }
    it("mathedos are replaced by 3s in object",function(){
        let o={};
        o.four=function(){ return 4};
        o.up=function(){ o.x+=1};
        o.x=0;

        let ow=wrapAll(wrapper3,o)
        assert.equal(ow.four,3)
        assert.equal(ow.up,3)
        assert.isUndefined(ow.x);
    })
});