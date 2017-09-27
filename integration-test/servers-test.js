let assert=require("chai").assert;
var request = require('supertest');
const run=require("./run");

describe("POST en /servers", function(){
    var app;
    var db;
    let agent=null;
    beforeEach(function(){
        this.timeout(5000);
        app =require("../server.js");
        agent=request.agent(app);
        return require("../restartDatabase.js")().then(()=>{
            return agent
            .post("/token")
            .send({username:"admin",password:"admin"})
        });
    });

    afterEach(function(){
        app.close();
    });

    it("Si es correcto, entra lo que sale",function(){
        var datosEnviados={
            "id":"asder",
            "_ref" :"asder",
            "createdBy":"jiji",
            "createdTime":50,
            "name":"servijiji",
            "lastConnection":1998
        };
        return agent
        .post("/servers")
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
    });

    it("Si no es correcto, vuelve el 400",function(){
        this.timeout(5000);
        var datosEnviados={
            "holi":"chauchi"
        };
        return agent
        .post("/servers")
        .send(datosEnviados)
        .expect(400)
    });

    it("A server is added and then requested (thorugh http)",function(){
        var s={
            "id":"asder",
            "_ref" :"asder",
            "createdBy":"jiji",
            "createdTime":50,
            "name":"serviji",
            "lastConnection":1998
        };
        var added=s;

        return run(
            ()=>agent
            .post("/servers")
            .send(s)
            .expect((e)=>{added=e.body.server.server})
            .expect(201),

            ()=>agent
            .get("/servers/"+added.id)
            .expect(200)
            .expect(function (res){
                assert.equal(res.body.server.createdBy,added.createdBy);
                assert.equal(res.body.server.createdTime,added.createdTime);
                assert.equal(res.body.server.id,added.id);
            }),
        )
    })

    it("A server is added, modified and then requested (thorugh http)",function(){
        var s={
            "id":"asder",
            "_ref" :"asder",
            "createdBy":"jiji",
            "createdTime":50,
            "name":"serviji",
            "lastConnection":1998
        };
        var added=s;
        
        return run(
            ()=>agent
            .post("/servers")
            .send(s)
            .expect((e)=>{
                added=e.body.server.server
            })
            .expect(201),

            ()=>{
                s.name="servikiki";
                s._ref=added._ref;
                s.id=added.id;
            },
            
            ()=>agent
            .put("/servers/"+added.id)
            .send(s)
            .expect(200),

            ()=>agent
            .get("/servers/"+added.id)
            .expect(200)
            .expect(function (res){
                assert.equal(res.body.server.createdBy,added.createdBy);
                assert.equal(res.body.server.createdTime,added.createdTime);
                assert.equal(res.body.server.name,s.name);
            })
        )
    })

    it("A server is added, then its token is updated",function(){
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
        
        return run(
            ()=>agent
            .post("/servers")
            .send(s)
            .expect((e)=>{added=e.body.server})
            .expect(201),

            ()=>agent
            .post("/servers/"+added.server.id)
            .expect(201)
            .expect((e)=>{newtoken=e.body.server})
            .expect(()=>{
                assert.equal(added.server.name,newtoken.server.name);
                assert.equal(added.server.id,newtoken.server.id);
                assert.notEqual(added.token.token,newtoken.token.token);
                assert.isBelow(added.token.expiresAt,newtoken.token.expiresAt);
            })
        );
    })

    it("A nonexistent server is requested",function(){
        return agent
        .get("/servers/72")
        .expect(404)
    })

    it("Multiple servers are added and then got",function(){
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

        let agregarServer=()=>agent
        .post("/servers")
        .send(s)
        .expect(agregarId)
        .expect(201);

        return run(
            agregarServer,
            agregarServer,
            agregarServer,
            ()=>agent
            .get("/servers").expect(200).expect(function(result){
                var list = result.body.servers;
                var ids=list.map((s)=>s.id);
                assert(intercepted.includes(ids[0]))
                assert(intercepted.includes(ids[1]))
                assert(intercepted.includes(ids[2]))
                assert.equal(ids.length,3);
            })

        )
    })

    it("Multiple servers are added and then got, one is deleted",function(){
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

        let agregarServer=()=>agent
        .post("/servers")
        .send(s)
        .expect(agregarId)
        .expect(201);

        return run(
            agregarServer,
            agregarServer,
            agregarServer,
            ()=>agent
            .delete("/servers/"+intercepted[0])
            .expect((res)=>{
                console.log(res.body);
            })
            .expect(204),

            ()=>agent.get("/servers").expect(200).expect(function(result){
                var list = result.body.servers;
                var ids=list.map((s)=>s.id);
                assert(ids.includes(intercepted[1]))
                assert(ids.includes(intercepted[2]))
                assert.equal(ids.length,2);
            })
        )
    })

    it("Delete nonexistent server",function(){
        return agent.delete("/servers/894").expect(404);
    })

});