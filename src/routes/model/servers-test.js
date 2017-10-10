let assert=require("chai").assert;
const servers=require("./servers")

describe("CRUD servers list", function(){
    var app;
    var db;
    const s={
        "id":"89",
        "_ref":"no matter",
        "createdBy":"pepe",
        "createdTime":15,
        "name":"pepeserver",
        "lastConnection":45
    };

    beforeEach(function(){
        this.timeout(5000);
        return require("./tables").restart();
    });
    it("A server is added and then requested",function(done){
        servers.add(s)
        .then((q)=>servers.get(q.id,"nope"))
        .then(function (result){
            assert.equal(result.createdBy,s.createdBy);
            assert.equal(result.createdTime,s.createdTime);
            assert.equal(result.name,s.name);
        })
        .then(done,done);
    })

    it("A fresh server is authorized and its identity is correct",function(){
        function b64d(t){
            return Buffer(t, 'base64').toString();
        }
        let identity=null;
        let added=null;
        return servers
        .add(s)
        .then((actual)=>added=actual)
        .then(()=>servers.authorized({token:b64d(added.token)},(e)=>identity=e))
        .then((a)=>{
            assert.isTrue(a);
            added.token=b64d(added.token);
            assert.deepEqual(identity,added);
        });
    })

    it("A random server is not authorized",function(){
        let identity=null;
        return servers
        .authorized({token:"USA DID 9 11"},(e)=>identity=e)
        .then((a)=>{
            assert.isFalse(a);
        });
    })

    it("A server is added, modified and then requested",function(done){
        var sRenamed={
            "id":"89",
            "_ref":"no matter",
            "createdBy":"pepe",
            "createdTime":15,
            "name":"kekeserver",
            "lastConnection":45
        };
        var sResult=null;
        
        servers.add(s)
        .then((res)=>{sResult=res;return res;})
        .then(()=>{
            sRenamed._ref=sResult._ref;
            return servers.update(sRenamed,sResult.id,"nope","badRevision")
        })
        .then((asd)=>{
            return servers.get(sResult.id,"nope")
        })
        .then(function (result){
            assert.equal(result.createdBy,s.createdBy);
            assert.equal(result.createdTime,s.createdTime);
            assert.equal(result.name,sRenamed.name);
        })
        .then(done,done);
    })

    it("A server is added, modified with wrong _ref",function(done){
        var sRenamed={
            "id":"89",
            "_ref":"no matter",
            "createdBy":"pepe",
            "createdTime":15,
            "name":"kekeserver",
            "lastConnection":45
        };
        var sResult=null;
        
        servers.add(s)
        .then((res)=>{sResult=res;return res;})
        .then(()=>{
            sRenamed._ref="juancito";
            return servers.update(sRenamed,sResult.id,"nope","badRevision")
        })
        .then((asd)=>{
            assert.equal(asd,"badRevision");
        })
        .then(done,done);
    })

    it("A nonexistent server is requested",function(done){
        servers.get(s.id,"nope")
        .then(function (result){
            assert.equal(result,"nope");
        })
        .then(done,done);
    })

    it("Multiple servers are added and then got",function(done){
        var s={
            "id":"5",
            "_ref":"no matter",
            "createdBy":"pepe",
            "createdTime":15,
            "name":"no matter",
            "lastConnection":45
        };
        var added=[]
        servers.add(s).then(function(e){
            added.push(e.id);
            return servers.add(s);
        }).then(function(e){
            added.push(e.id);
            return servers.add(s);
        }).then(function(e){
            added.push(e.id);
            return servers.list()
        }).then(function(result){
            var list = result;
            
            var ids=list.map((s)=>s.id);
            assert(ids.includes(added[0]))
            assert(ids.includes(added[1]))
            assert(ids.includes(added[2]))
            assert.equal(ids.length,3);
        }).then(done,done);
    })

    it("Multiple servers are added,one is deleted, the rest are got",function(done){
        var s={
            "id":"8",
            "_ref":"no matter",
            "createdBy":"pepe",
            "createdTime":15,
            "name":"no matter",
            "lastConnection":45
        };
        var added=[];
                   servers.add(s)
          .then(function(e){
            added.push(e.id)
            return servers.add(s);
        }).then(function(e){
            added.push(e.id)
            return servers.add(s);
        }).then(function(e){
            added.push(e.id)
            return servers.delete(added[2])
        }).then(function(){
            return servers.list()
        }).then(function(result){
            var list = result
            var ids=list.map((s)=>s.id);
            assert(ids.includes(added[0]))
            assert(ids.includes(added[1]))
            assert.equal(ids.length,2);
        }).then(done,done);
    })

});