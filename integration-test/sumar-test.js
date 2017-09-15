let assert=require("chai").assert;
let sumar=require("./sumar.js");//require.main.require("src/sumar.js")//la única manera no-hack de hacer un require global

describe("sumar",function(){
	it("positivos",function(){
		assert.equal(sumar(2,7),9);
	});
});

before(function(){
	global.srcRequire=function(name){
		return require(__dirname+"/src/"+name)
	}
});

