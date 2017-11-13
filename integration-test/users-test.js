let assert=require("chai").assert;
var request = require('supertest');

const log=require("debug")("fiuber:tests")

describe("using users",function(){
    var app;
    let agent=null;
    let authValue="";
    let serverId="";
    let adminAuthValue="";
    before(function(){
        this.timeout(5000);
        app =require("../server.js");
        agent=request.agent(app);
        
        return require("../restartDatabase.js")()
        .then(()=>{//login
            return agent
            .post("/token")
            .send({username:"admin",password:"admin"}).then((res)=>{
                authValue="api-key "+res.body.token.token;
                adminAuthValue=authValue;
                //hago request.set("authorization",authValue) todo el tiempo
                assert.equal(res.statusCode,201);
            })
        }).then(()=>{//POST a new server and keep the id
            var datosEnviados={
                "id":"asder",
                "_ref" :"asder",
                "createdBy":"jiji",
                "createdTime":50,
                "name":"server",
                "lastConnection":1998
            };
            return agent
            .post("/servers")
            .set("authorization",authValue)
            .send(datosEnviados)
            .expect((res)=>{
                assert.equal(res.statusCode,201);
                let token = res.body.server.token.token;
                authValue="api-key "+token;
                serverId=res.body.server.server.id;
            })
        })
    });

    it("add a not-fb user",function(){
        return agent
        .post("/users")
        .set("authorization", authValue)
        .send({
            _ref:"1",
            type:"passenger",
            username:"soyyo5159",
            password:"5159",
            firstName:"José",
            lastName:"Ignacio",
            country:"Argentina",
            email:"soyyo5159@hotmail.com",
            birthdate:"oneday",
            images:[
                "serio.png",
                "muy serio.png",
                "playa.png"
            ]
        })
    })

    describe("login as that user",function(){
        it("login as a normal user",function(){
            return agent
            .post("/users/validate")
            .set("authorization", authValue)
            .send({
                username:"soyyo5159",
                password:"5159"
            }).expect(201)//fuera de la documentación, pero arreglarlo es demasiado complejo
        })
    
        it("login as a fb user",function(){
            return agent
            .post("/users/validate")
            .set("authorization", authValue)
            .send({
                username:"soyyo5159",
                facebookAuthToken:"face"
            }).expect(400)
        })
    
        it("login as a normal user,bad credentials",function(){
            return agent
            .post("/users/validate")
            .set("authorization", authValue)
            .send({
                username:"soyyo5159",
                password:"52"
            }).expect(400)
        })
    })
    

    it("add a fb user, but as an admin",function(){
        return agent
        .post("/users")
        .set("authorization", adminAuthValue)
        .send({
            _ref:"78",
            type:"passenger",
            username:"fayo5159",
            fb:{
                userId:"face",
                authToken:"face"
            },
            firstName:"Facé",
            lastName:"Igfacio",
            country:"Argentina",
            email:"soyyo5159@hotmail.com",
            birthdate:"oneday",
            images:[
                "serio.png",
                "muy serio.png",
                "playa.png"
            ]
        }).expect(201)
        /*
        .then((res)=>{
            log(res);
        })
        */
    })

    describe("Login as that user",function(){
        it("login as a fb user",function(){
            return agent
            .post("/users/validate")
            .set("authorization", authValue)
            .send({
                username:"fayo5159",
                facebookAuthToken:"face"
            }).expect(201)
        })
    
        it("login as normal user",function(){
            return agent
            .post("/users/validate")
            .set("authorization", authValue)
            .send({
                username:"fayo5159",
                password:"face"
            }).expect(400)
        })
    
        it("login as fb user, bad credentials",function(){
            return agent
            .post("/users/validate")
            .set("authorization", authValue)
            .send({
                username:"fayo5159",
                facebookAuthToken:"57"
            }).expect(400)
        })
    })


    describe("deleting modifying and getting users",function(){
        let id_soyyo5159="";
        let id_fayo5159="";
        let ref_soyyo5159="";
        it("listings show those users",function(){
            return agent
            .get("/users")
            .set("authorization", authValue)
            .expect(200)
            .expect(function(res){
                log(res.body);
                let soyyo5159=null;
                for(let u of res.body.users){
                    if(u.username==="soyyo5159"){
                        soyyo5159=u;
                    }
                }
                ref_soyyo5159=soyyo5159._ref;
                id_soyyo5159=soyyo5159.id;
                assert.isNotNull(soyyo5159);
                assert.equal(soyyo5159.applicationOwner,serverId);
                assert.equal(soyyo5159.images.length,3);
                
                let owner_fayo5159=""
                let has_fayo5159=res.body.users.some((u)=>{
                    if(u.username==="fayo5159"){
                        id_fayo5159=u.id;
                        owner_fayo5159=u.applicationOwner;
                    }
                    return u.username==="fayo5159"
                })
                assert.isTrue(has_fayo5159,"doesnt have fayo5159")
                assert.equal(owner_fayo5159,"admin")//admin is the owner of this user
            })
        })
    
        it("the user can be deleted",function(){
            return agent
            .delete("/users/"+id_fayo5159)
            .set("authorization", authValue)
            .expect(204)
        })

        it("The user cannot be modified with bad ref",function(){
            return agent
            .put("/users/"+id_soyyo5159)
            .set("authorization", authValue)
            .send({
                _ref:"1",
                type:"passenger",
                username:"soyyo5159",
                password:"5159",
                firstName:"asd",
                lastName:"Ignacio",
                country:"Argentina",
                email:"soyyo5159@hotmail.com",
                birthdate:"q",
                images:[
                    "serio.png",
                    "muy serio.png",
                    "playa.png"
                ]
            }).expect(400)
        })

        it("The user can be modified with good ref",function(){
            return agent
            .put("/users/"+id_soyyo5159)
            .set("authorization", authValue)
            .send({
                _ref:ref_soyyo5159,
                type:"driver",
                username:"soyyo5159",
                password:"5159",
                firstName:"Josecito",
                lastName:"Ignacito",
                country:"Argentina",
                email:"soyyo5159@hotmail.com",
                birthdate:"q",
                images:[
                    "serio.png",
                    "muy serio.png",
                    "playa.png"
                ]
            }).expect(200)
            .expect(function(res){
                assert.include(res.body.user,{
                    name:"Josecito",
                    birthdate:"q"
                })
            })
        })


        describe("cars CRUD",function(){
            let carId="";
            let carRef="";

            it("add a car",function(){
                return agent
                .post("/users/"+id_soyyo5159+"/cars/")
                .set("authorization", authValue)
                .send({
                    id:"asd",
                    _ref:"asd",
                    owner:"asd",
                    properties:[
                        {
                            name:"ventana",
                            value:"150"
                        },
                        {
                            name:"volante",
                            value:"72"
                        }
                    ]
                })
                .expect(201)
                .expect((res)=>{
                    carId=res.body.car.id;
                    carRef=res.body.car._ref;
                })
            })
            it("there is only one car in the list of cars",function(){
                return agent
                .get("/users/"+id_soyyo5159+"/cars")
                .set("authorization", authValue)
                .expect(200)
                .expect((res)=>{
                    let cars = res.body.cars;
                    assert.equal(cars.length,1)
                    assert.include(cars[0],{
                        id:carId,
                        _ref:carRef,
                        owner:id_soyyo5159
                    })

                    let ventana150=cars[0].properties.some((p)=>{
                        return p.name==="ventana" && p.value==150
                    })
                    assert.isTrue(ventana150,"Window is not around")

                    let volante72=cars[0].properties.some((p)=>{
                        return p.name==="volante" && p.value==72
                    })
                    assert.isTrue(volante72,"Wheel is not around")
                })
            })

            it("the car is updated",function(){
                return agent
                .put("/users/"+id_soyyo5159+"/cars/"+carId)
                .set("authorization", authValue)
                .send({
                    id:1,
                    _ref:carRef,
                    owner:id_soyyo5159,
                    properties:[
                        {
                            name:"asiento roto",
                            value:"4"
                        }
                    ]
                })
                .expect(200)
                .expect((res)=>{
                    assert.deepEqual(res.body.car,{
                        id:carId,
                        _ref:carRef,
                        owner:id_soyyo5159,
                        properties:[
                            {
                                name:"asiento roto",
                                value:"4"
                            }
                        ]
                    })
                    carRef=res.body.car._ref;
                })
            })

            it("Get only that car",function(){
                return agent
                .get("/users/"+id_soyyo5159+"/cars/"+carId)
                .set("authorization", authValue)
                .expect(200)
                .expect((res)=>{
                    assert.deepEqual(res.body.car,{
                        id:carId,
                        _ref:carRef,
                        owner:id_soyyo5159,
                        properties:[
                            {
                                name:"asiento roto",
                                value:"4"
                            }
                        ]
                    })
                    carRef=res.body.car._ref;
                })
            })

            it("Remove that car",function(){
                return agent
                .delete("/users/"+id_soyyo5159+"/cars/"+carId)
                .set("authorization", authValue)
                .expect(204)
            })

            it("there are no cars in the list of cars",function(){
                return agent
                .get("/users/"+id_soyyo5159+"/cars")
                .set("authorization", authValue)
                .expect(200)
                .expect((res)=>{
                    let cars = res.body.cars;
                    assert.equal(cars.length,0);
                })
            })

        })

    })

})