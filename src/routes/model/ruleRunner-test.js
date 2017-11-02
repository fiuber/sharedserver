const assert=require("chai").assert;
const ruleRunner=require("./ruleRunner");

describe.only("how ruleRunner works",()=>{
    it("example from the wiki",()=>{
        let ruleStr=JSON.stringify(
            {
                condition: 'function (R) {R.when(this && (this.transactionTotal < 500));}',
                consequence: 'function (R) {this.result = false;R.stop();}',
                on: true
            }
        );
    

        let factStr=JSON.stringify({
            "transactionTotal":400
        });

        return ruleRunner.runStrings([ruleStr],[factStr]).then((result)=>{
            assert.isFalse(result.result);
        });

    })
})
