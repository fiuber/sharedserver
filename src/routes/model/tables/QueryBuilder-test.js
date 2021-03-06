let assert=require("chai").assert;
const QueryBuilder=require("./QueryBuilder");

describe("query builder",function(){
    let fields={
        "f1":"bigint",
        "f2":"serial",
        "f3":"text"
    }
    let builder=new QueryBuilder("table_name",fields,["f1"]);
    it("drop",function(){
        assert.equal("drop table if exists table_name cascade",builder.drop())
    })

    it("create",function(){
        assert.equal(
            builder.create(),
            "create table table_name(f1 bigint, f2 serial, f3 text, primary key (f1));"
        )
    })

    it("insert",function(){
        assert.equal(
            builder.insert(),
            "insert into table_name(f1,f3) values($1,$2) returning f1,f2,f3"
        )
    })

    it("simple select", function(){
        assert.equal(
            builder.select().all(),
            "select * from table_name;"
        );
    })

    it("simple select", function(){
        assert.equal(
            builder.select().where({}),
            "select * from table_name "
        );
    })

    it("select where", function(){
        assert.equal(
            builder.select().where({f1:4,f2:58}),
            "select * from table_name where f1 = $1 and f2 = $2"
        );
    })

    it("select where limit offset", function(){
        assert.equal(
            builder.select().where({f1:4,f2:58,_limit:10,_offset:5}),
            "select * from table_name where f1 = $1 and f2 = $2"
        );
    })

    it("select with lt and gt", function(){
        assert.equal(
            builder.select().where({f1_lt:4,f2_gt:58}),
            "select * from table_name where f1 < $1 and f2 > $2"
        );
    })
    

    it("select with lte and gte", function(){
        assert.equal(
            builder.select().where({f1_lte:4,f2_gte:58}),
            "select * from table_name where f1 <= $1 and f2 >= $2"
        );
    })

    it("select with matches", function(){
        assert.equal(
            builder.select().where({f1_matches:"asddd",f2_eq:3}),
            "select * from table_name where f1 ~~ $1 and f2 = $2"
        );
    })



    it("numbered fields", function(){
        assert.equal(
            builder.numberedFields({f3:7,f1:8}),
            "f1=$1, f3=$2"
        )
    })
    it("delete",function(){
        assert.equal(
            builder.delete(),
            "delete from table_name"
        )
    })

    it("delete where",function(){
        assert.equal(
            builder.delete().where({asd:5,f1:3}),
            "delete from table_name where f1 = $1"
        )
    })

    it("simple update", function(){
        assert.equal(
            builder.update({f1:7,asd:"p"}),
            "update table_name set f1=$1"
        )
    })

    it("update where", function(){
        assert.equal(
            builder.update({f1:7,asd:"p"}).where({f2:8}),
            "update table_name set f1=$1 where f2=$2"
        )
    })
})