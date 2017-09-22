let assert=require("chai").assert;
const FastPromiser=require("./FastPromiser")

describe("Fast promises work",function(){
    let o={value:0}
    o.add=function(n){
        this.value+=n;
        return Promise.resolve()
    }
    o.get=function(){
        return Promise.resolve(this.value);
    }
    let fo=new FastPromiser(o);

    beforeEach(function(){
        o.value=0;
    })

    it("many chained actions 1",function(){
        console.log(fo);
        return fo.add(5).add(7).get().then(function(r){
            assert.equal(r,12)
        });
    })

    it("many chained actions 2",function(){
        return fo.add(5).add(7).then(function(){
            assert.equal(o.value,12)
        });
    })
})