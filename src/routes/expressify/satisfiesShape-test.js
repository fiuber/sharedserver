let assert=require("chai").assert;
let satisfiesShape=require("./satisfiesShape.js")

describe("funcionamiento de satisfiesShape",function(){

    it("dos JSON simples",function(){
        assert(satisfiesShape(
            {a:"x",b:"y"},
            {a:"z",b:"q"}
        ))
    })

    it("JSON simples, uno mayor que el otro",function(){
        assert(satisfiesShape(
            {a:"x",b:"y",k:"k"},
            {a:"z",b:"q"}
        ))
    })

    it("JSON con más JSON adentro",function(){
        assert(satisfiesShape(
            {a:"x",b:{c:"c",d:"d"},k:"k"},
            {a:"z",b:{c:"p",d:"q"}}
        ))
    })

    it("JSON simples no tienen la misma forma",function(){
        assert(!satisfiesShape(
            {a:"x",b:{c:"c",d:"d"},k:"k"},
            {t:"z"}
        ))
    })

    it("JSON complejos no tienen la misma forma",function(){
        assert(!satisfiesShape(
            {a:"x",b:{c:"c",d:"d"},k:"k"},
            {a:"z",b:{p:"q"}}
        ))
    })
})