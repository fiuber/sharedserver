let assert=require("chai").assert;
var request = require('supertest');
const run=require("./run");

describe.only("POST en /servers", function(){
    var app;
    var db;
    let agent=null;
    let authValue="";
    beforeEach(function(){
        this.timeout(5000);
        app =require("../server.js");
        agent=request.agent(app);
        return require("../restartDatabase.js")().then(()=>{
            return agent
            .post("/token")
            .send({username:"admin",password:"admin"}).then((res)=>{
                authValue="api-key "+res.body.token.token;
                //hago request.set("authorization",authValue) todo el tiempo
            })
        });
    });

    afterEach(function(){
        app.close();
    });

    it("Si es correcto, entra lo que sale",function(){
        let now = (new Date()).getTime();
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
        .set("authorization",authValue)
        .send(datosEnviados)
        .expect(function(res){
            assert.equal(res.statusCode,201,res.error);

            assert.equal(res.body.server.server.createdBy,"admin");
            assert.isAbove(res.body.server.server.createdTime,now);
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
        .set("Authorization",authValue)
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
            .set("Authorization",authValue)
            .send(s)
            .expect((e)=>{added=e.body.server.server})
            .expect(201),

            ()=>agent
            .get("/servers/"+added.id)
            .set("Authorization",authValue)
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
            .set("Authorization",authValue)
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
            .set("Authorization",authValue)
            .send(s)
            .expect(200),

            ()=>agent
            .get("/servers/"+added.id)
            .set("Authorization",authValue)
            .expect(200)
            .expect(function (res){
                assert.equal(res.body.server.createdBy,added.createdBy);
                assert.equal(res.body.server.createdTime,added.createdTime);
                assert.equal(res.body.server.name,s.name);
            })
        )
    })

    it("A server is added, pinged and then requested (thorugh http)",function(){
        var s={
            "id":"asder",
            "_ref" :"asder",
            "createdBy":"jiji",
            "createdTime":50,
            "name":"serviji",
            "lastConnection":1998
        };
        var added=s;
        let serverAuth="";
        
        return run(
            ()=>agent
            .post("/servers")
            .set("Authorization",authValue)
            .send(s)
            .expect((e)=>{
                added=e.body.server
                serverAuth="api-key "+e.body.server.token.token;
            })
            .expect(201),
            
            ()=>agent
            .post("/servers/ping")
            .set("Authorization",serverAuth)
            .send({})
            .expect(function (res){
                console.log(res.body.ping.token);
                console.log(added.token);
                assert.isAbove(res.body.ping.token.expiresAt,added.token.expiresAt)
                assert.equal(res.body.ping.server.createdBy,added.server.createdBy);
                assert.equal(res.body.ping.server.createdTime,added.server.createdTime);
                assert.equal(res.body.ping.server.name,s.name);
            })
            .expect(201),
            
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
            .set("Authorization",authValue)
            .send(s)
            .expect((e)=>{added=e.body.server})
            .expect(201),

            ()=>agent
            .post("/servers/"+added.server.id)
            .set("Authorization",authValue)
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
        .set("Authorization",authValue)
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
        .set("Authorization",authValue)
        .send(s)
        .expect(agregarId)
        .expect(201);

        return run(
            agregarServer,
            agregarServer,
            agregarServer,
            ()=>agent
            .get("/servers")
            .set("Authorization",authValue)
            .expect(200).expect(function(result){
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
        .set("Authorization",authValue)
        .send(s)
        .expect(agregarId)
        .expect(201);

        return run(
            agregarServer,
            agregarServer,
            agregarServer,
            ()=>agent
            .delete("/servers/"+intercepted[0])
            .set("Authorization",authValue)
            .expect(204),

            ()=>agent
            .get("/servers")
            .set("Authorization",authValue)
            .expect(200).expect(function(result){
                var list = result.body.servers;
                var ids=list.map((s)=>s.id);
                assert(ids.includes(intercepted[1]))
                assert(ids.includes(intercepted[2]))
                assert.equal(ids.length,2);
            })
        )
    })

    it("Delete nonexistent server",function(){
        return agent
        .delete("/servers/894")
        .set("Authorization",authValue)
        .set("Authorization",authValue).expect(404);
    })

});