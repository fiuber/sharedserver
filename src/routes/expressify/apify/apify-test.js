let assert=require("chai").assert;
let apify=require("./apify.js")

describe("funcionamiento de apify",function(){
    var status=0;
    var message=null
    function record(s,m){
        status=s;
        message=m;
    }

    let persistence={
        data:null,
        set:function(newData){
            this.data=newData;
        }
    }

    function same(body){
        return body;
    }
    function never(body,inexistent){
        return inexistent;
    }
    function failer(){
        return Promise.reject("It failed");
    }
    function parameterized(body,par1,par2,nonexistent,badRevision){
        return [par1,par2];
    }

    function changeMe(nonexistent,badRevision,me){
        me.q=5;
    }

    beforeEach(function(){
        status=0;
        message=null;
        persistence.data={
            q:1,
            p:2
        }
        
    })

    it("receive the same data that was correctly sent",function(done){
        let dataAndShape={a:"b"};
        let apifiedSame=apify(dataAndShape,same);
        Promise.resolve(apifiedSame(dataAndShape,record,{},persistence)).then(function(){
            assert.deepEqual(dataAndShape,message);
            assert.deepEqual(status,apify.SUCCESS);
        }).then(done,done);
    })

    it("receive an error if wrong data is sent",function(done){
        let apifiedSame=apify({a:"b"},same);
        Promise.resolve(apifiedSame({b:"x"},record,{},persistence)).then(function(){
            assert.equal(status,apify.BAD_REQUEST);
        }).then(done,done);
    })

    

    it("Receive 500 if there is an exception",function(done){
        let apifiedFailer=apify({a:"b"},failer);
        Promise.resolve(apifiedFailer({a:"x"},record,{},persistence)).then(function(){
            assert.equal(status,apify.ERROR);
        }).then(done,done);
    })

    it("Receive 404 if the resource is inexistent",function(done){
        let appifiedNever=apify({a:"b"},never);
        Promise.resolve(appifiedNever({a:"x"},record,{},persistence)).then(function(){
            assert.equal(status,apify.BAD_RESOURCE);
        }).then(done,done)
    })

    it("Receive parameters if they are used",function(done){
        let apifiedParamterized=apify({a:"b"},parameterized);
        Promise.resolve(apifiedParamterized({a:"x"},record,[4,5],persistence)).then(function(){
            assert.equal(status,apify.SUCCESS);
            let o=[4,5];
            assert.deepEqual(o,message);
        }).then(done,done);
    })

    it("Receive 400 if wrong number of parameters is sent",function(done){
        let apifiedParamterized=apify({a:"b"},parameterized);
        Promise.resolve(apifiedParamterized({a:"x"},record,[],persistence)).then(function(){
            assert.equal(status,apify.BAD_REQUEST);
        }).then(done,done);
    })

    it("Persistence works",function(done){
        let apified=apify({},changeMe);
        Promise.resolve(apified({},record,[],persistence)).then(function(){
            assert.equal(status,apify.SUCCESS);
            assert.deepEqual(persistence.data,{
                q:5,
                p:2
            });
        }).then(done,done);

    })
})