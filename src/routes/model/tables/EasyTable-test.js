const assert=require("chai").assert;
const EasyTable=require("./EasyTable");

describe("Usage of EasyTable ",function(){

    const userJose={
        userName:"jose",
        userAge:8,
        userId:72
    }
    let fields={
        userName:"varchar(40)",
        userAge:"int",
        userId:"serial"
    };
    let table= new EasyTable("table_test",fields,["userId"]);

    beforeEach(function(){
        this.timeout(5000);
        return table.delete();
    })

    it("nothing exists",function(){
        return table.exists({userName:"jose"}).then((ret)=>{
            assert.isFalse(ret);
        })
    })


    it("after creating something, it exists",function(){
        return table.create(userJose).exists({userName:userJose.userName}).then((ret)=>{
                assert.isTrue(ret);
        })
        
        
    })

    it("after creating something, it can be read",function(){
        return table.create(userJose).then((added)=>{
            return table.read(added).then((read)=>{
                assert.deepEqual(added,read[0]);
            })
        })
    })

    it("after creating something, it can be updated",function(){
        return table
        .create(userJose)
        .update({userName:"jose"},{userAge:7})
        .read({userName:"jose"})
        .then((ret)=>{
            assert.equal(ret[0].userName,userJose.userName);
            assert.equal(ret[0].userAge,7);
        })
    })

    it("after creating something and deleting it, it no longer exists",function(){
        return table
        .create(userJose)
        .delete({userName:"jose"})
        .exists({userName:"jose"})
        .then((exists)=>{
            assert.isFalse(exists);
        })
    })

    it("after creating two things, getting the whole table return both rows",function(){
        return table
        .create(userJose)
        .create({userName:"pepe",userAge:15})
        .read()
        .then((all)=>{
            assert.equal(all.length,2);
            assert.equal(all[0].userName,"jose")
            assert.equal(all[1].userName,"pepe")
        })
    })
});