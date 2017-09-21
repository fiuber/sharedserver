let assert=require("chai").assert;
const PostgresTable=require("./PostgresTable")

describe("Using a PostgresTable",function(){
    let fields={
        f1:"varchar(40)",
        f2:"int",
        f3:"serial"
    };
    let table= new PostgresTable("table_test",fields,["f1"]);
    beforeEach(function(){
        this.timeout(5000);
        return table.restart();
    })

    it("nothing exists",function(){
        return table.exists({f1:"asd"}).then((ret)=>{
            assert.isFalse(ret);
        })
    })

    it("after adding something, it exists",function(){
        return table.add({f1:"asd",f2:5}).then(()=>{
            return table.exists({f1:"asd"}).then((ret)=>{
                assert.isTrue(ret);
            })
        })
    })

    it("after adding something, it exists",function(){
        return table.add({f1:"asd",f2:5}).then(()=>{
            return table.exists({f1:"asd"}).then((ret)=>{
                assert.isTrue(ret);
            })
        })
    })

    it("after adding something, it can be got",function(){
        return table.add({f1:"asd",f2:5}).then(()=>{
            return table.get({f1:"asd"}).then((ret)=>{
                assert.equal(ret[0].f1,"asd")
                assert.equal(ret[0].f2,5)
            })
        })
    })

    it("after adding something, it can be got",function(){
        return table.add({f1:"asd",f2:5}).then(()=>{
            return table.get({f1:"asd"}).then((ret)=>{
                assert.equal(ret[0].f1,"asd")
                assert.equal(ret[0].f2,5)
            })
        })
    })

    it("after adding something, it can be modified",function(){
        return table.add({f1:"asd",f2:5}).then(()=>{
            return table.modify({f1:"asd"},{f2:9}).then(()=>{
                return table.get({f1:"asd"}).then((ret)=>{
                    assert.equal(ret[0].f1,"asd")
                    assert.equal(ret[0].f2,9)
                })
            })
        })
    })

    it("after adding something and deleting it, it no longer exists",function(){
        return table.add({f1:"asd",f2:5}).then(()=>{
            return table.remove({f1:"asd"}).then(()=>{
                return table.exists({f1:"asd"}).then((ret)=>{
                    assert.isFalse(ret);
                })
            })
        })
    })

    it("after adding two things, listing returns both",function(){
        return table.add({f1:"asd",f2:5}).then(()=>{
            return table.add({f1:"fgh",f2:5}).then(()=>{
                return table.list().then((list)=>{
                    assert.equal(list.length,2)
                })
            })
        })
    })
})