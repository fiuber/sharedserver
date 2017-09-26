let assert=require("chai").assert;
var request = require('supertest');


describe("POST en /servers", function(){
    var app;
    var db;
    let cookie=null;
    beforeEach(function(){
        this.timeout(5000);
        app =require("../server.js");
        return require("../restartDatabase.js")().then(()=>{
            return request(app)
            .post("/token")
            .send({username:"admin",password:"admin"})
            .expect((res)=>{
                console.log("Y AL RECIBIR LA RESPONSE:",res.get("Set-Cookie"));
                let token=res.body.token.token;
                cookie=[
                    "username=admin",
                    "token="+token
                ];
            })
        });
        //return require("../database.js").restarted();
    });
    afterEach(function(){
        app.close();
    });
    it("Si es correcto, entra lo que sale",function(done){
        this.timeout(5000);
        var datosEnviados={
            "id":"asder",
            "_ref" :"asder",
            "createdBy":"jiji",
            "createdTime":50,
            "name":"servijiji",
            "lastConnection":1998
        };
        request(app)
        
        .post("/servers")
        .set("Cookie",cookie)
        
        .send(datosEnviados)
        .expect(function(res){
            assert.equal(res.statusCode,201,res.error);

            assert.equal(res.body.server.server.createdBy,datosEnviados.createdBy);
            assert.equal(res.body.server.server.createdTime,datosEnviados.createdTime);
            assert.equal(res.body.server.server.name,datosEnviados.name);

            var tok = res.body.server.token;
            assert.isAbove(tok.expiresAt, Date.now());
            assert.isOk(tok.token);
        })
        .end(done);
    });

    it("Si no es correcto, vuelve el 400",function(done){
        this.timeout(5000);
        var datosEnviados={
            "holi":"chauchi"
        };
        request(app)
        .post("/servers")
        .set("Cookie",cookie)
        .send(datosEnviados)
        .expect(400)
        .end(done);
    });

    it("A server is added and then requested (thorugh http)",function(done){
        var s={
            "id":"asder",
            "_ref" :"asder",
            "createdBy":"jiji",
            "createdTime":50,
            "name":"serviji",
            "lastConnection":1998
        };
        var added=s;
        request(app)
        .post("/servers")
        .set("Cookie",cookie)
        .send(s)
        .expect((e)=>{added=e.body.server.server})
        .expect(201).end(function(){
            return request(app)
            .get("/servers/"+added.id)
            .set("Cookie",cookie)
            .expect(200)
            .expect(function (res){
                assert.equal(res.body.server.createdBy,added.createdBy);
                assert.equal(res.body.server.createdTime,added.createdTime);
                assert.equal(res.body.server.id,added.id);
            })
            .end(done);
        });
    })

    it("A server is added, modified and then requested (thorugh http)",function(done){
        var s={
            "id":"asder",
            "_ref" :"asder",
            "createdBy":"jiji",
            "createdTime":50,
            "name":"serviji",
            "lastConnection":1998
        };
        var added=s;
        var sRenamed=s;
        sRenamed.name="servikiki"
        request(app)
        .post("/servers")
        .set("Cookie",cookie)
        .send(s)
        .expect((e)=>{added=e.body.server.server})
        .expect(201).end(function(){
            return request(app)
            .put("/servers/"+added.id)
            .set("Cookie",cookie)
            .send(sRenamed)
            .expect(200)
            .end(function(){
                return request(app)
                .get("/servers/"+added.id)
                .set("Cookie",cookie)
                .expect(200)
                .expect(function (res){
                    assert.equal(res.body.server.createdBy,added.createdBy);
                    assert.equal(res.body.server.createdTime,added.createdTime);
                    assert.equal(res.body.server.name,sRenamed.name);
                })
                .end(done);
            });
        });
    })

    it("A server is added, then its token is updated",function(done){
        var s={
            "id":"asder",
            "_ref" :"asder",
            "createdBy":"jiji",
            "createdTime":50,
            "name":"serviji",
            "lastConnection":1998
        };
        var added=s;
        var newtoken=s;
        
        request(app)
        .post("/servers")
        .set("Cookie",cookie)
        .send(s)
        .expect((e)=>{added=e.body.server})
        .expect(201).end(function(){
            return request(app)
            .post("/servers/"+added.server.id)
            .set("Cookie",cookie)
            .expect(201)
            .expect((e)=>{newtoken=e.body.server})
            .expect(()=>{
                assert.equal(added.server.name,newtoken.server.name);
                assert.equal(added.server.id,newtoken.server.id);
                assert.notEqual(added.token.token,newtoken.token.token);
                assert.isBelow(added.token.expiresAt,newtoken.token.expiresAt);
            }).end(done)
        });
    })

    it("A nonexistent server is requested",function(done){
        request(app)
        .get("/servers/72")
        .set("Cookie",cookie)
        .expect(404)
        .end(done);
    })

    it("Multiple servers are added and then got",function(done){
        var s={
            "id":"serv1",
            "_ref":"no matter",
            "createdBy":"pepe",
            "createdTime":15,
            "name":"aaaaav1",
            "lastConnection":45
        };
        var intercepted=[]
        function agregarId(res){
            intercepted.push(res.body.server.server.id)
        }
        request(app).post("/servers").set("Cookie",cookie).send(s).expect(agregarId).expect(201).end(function(){
            return request(app).post("/servers").set("Cookie",cookie).send(s).expect(agregarId).expect(201).end(function(){
                return request(app).post("/servers").set("Cookie",cookie).send(s).expect(agregarId).expect(201).end(function(){
                    return request(app).get("/servers").set("Cookie",cookie).expect(200).expect(function(result){
                        var list = result.body.servers;
                        var ids=list.map((s)=>s.id);
                        assert(intercepted.includes(ids[0]))
                        assert(intercepted.includes(ids[1]))
                        assert(intercepted.includes(ids[2]))
                        assert.equal(ids.length,3);
                    }).end(done)
                    
                })
            })
        })
    })

    it("Multiple servers are added and then got, one is deleted",function(done){
        var s={
            "id":"serv1",
            "_ref":"no matter",
            "createdBy":"pepe",
            "createdTime":15,
            "name":"aav1",
            "lastConnection":45
        };
        var intercepted=[]
        function agregarId(res){
            intercepted.push(res.body.server.server.id)
        }
        request(app).post("/servers").set("Cookie",cookie).send(s).expect(agregarId).expect(201).end(function(){
            return request(app).post("/servers").set("Cookie",cookie).send(s).expect(agregarId).expect(201).end(function(){
                return request(app).post("/servers").set("Cookie",cookie).send(s).expect(agregarId).expect(201).end(function(){
                    return request(app).delete("/servers/"+intercepted[0]).set("Cookie",cookie).expect(204).end(function(){

                        return request(app).get("/servers").set("Cookie",cookie).expect(200).expect(function(result){
                            var list = result.body.servers;
                            var ids=list.map((s)=>s.id);
                            assert(ids.includes(intercepted[1]))
                            assert(ids.includes(intercepted[2]))
                            assert.equal(ids.length,2);
                        }).end(done)
                    });
                })
            })
        })
    })

    it("Delete nonexistent server",function(done){
        request(app).delete("/servers/894").set("Cookie",cookie).expect(404).end(done);
    })

});