let assert=require("chai").assert;
let satisfiesShape=require("./satisfiesShape.js")

describe("funcionamiento de satisfiesShape",function(){

    it("dos JSON simples",function(){
        assert(satisfiesShape(
            {a:"x",b:"y"},
            {a:"z",b:"q"}
        ).valueOf())
    })

    it("JSON simples, uno mayor que el otro",function(){
        assert(satisfiesShape(
            {a:"x",b:"y",k:"k"},
            {a:"z",b:"q"}
        ).valueOf())
    })

    it("JSON con más JSON adentro",function(){
        assert(satisfiesShape(
            {a:"x",b:{c:"c",d:"d"},k:"k"},
            {a:"z",b:{c:"p",d:"q"}}
        ).valueOf())
    })

    it("JSON simples no tienen la misma forma",function(){
        assert(!satisfiesShape(
            {a:"x",b:{c:"c",d:"d"},k:"k"},
            {t:"z"}
        ).valueOf())
    })

    it("JSON complejos no tienen la misma forma",function(){
        let v=satisfiesShape(
            {a:"x",b:{c:"c",d:"d"},k:"k"},
            {a:"z",b:{p:"q"}}
        )
        console.log("8888888888888888")
        console.log("8888888888888888")
        console.log("8888888888888888")
        console.log(v)
        console.log("8888888888888888")
        console.log("8888888888888888")
        console.log("8888888888888888")
        assert(!v)
    })
})