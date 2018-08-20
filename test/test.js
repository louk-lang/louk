const louk = require("../louk.js")
const chai = require("chai")
const assert = chai.assert

describe("Louk Unchanged", function(){
    it("should return a simple element", function(){
        assert.equal(louk('a'),'<a></a>')
    })
    it("should return two peer elements", function(){
        assert.equal(louk('a\nb'),'<a></a><b></b>')
    })
    it("should return a nested element", function(){
        assert.equal(louk('a\n\tb'),'<a><b></b></a>')
    })
    it("should return a simple element when indented once", function(){
        assert.equal(louk('\ta'),'<a></a>')
    })
    it("should return a simple element when indented twice", function(){
        assert.equal(louk('\t\ta'),'<a></a>')
    })
    it("should return an element with dynamic content", function(){
        assert.equal(louk('a b'),'<a>{{b}}</a>')
    })
    it("should return a an element with a class", function(){
        assert.equal(louk('a\n.c'),'<a class="c"></a>')
    })
    it("should return a an element with an ID", function(){
        assert.equal(louk('a\n#c'),'<a id="c"></a>')
    })
    it("should return two peer nested elements", function(){
        assert.equal(louk('a\n\tb\nc\n\td'),'<a><b></b></a><c><d></d></c>')
    })
    it("should return a double nested element", function(){
        assert.equal(louk('a\n\tb\n\t\tc'),'<a><b><c></c></b></a>')
    })
    it("should return a double nested element with a trailing line", function(){
        assert.equal(louk('a\n\tb\n\t\tc\n'),'<a><b><c></c></b></a>')
    })
    it("should handle multiple consecutive closures", function(){
        assert.equal(louk('a\n\tb\n\t\tc\nd'),'<a><b><c></c></b></a><d></d>')
    })

})

describe("Louk New Grammar", function(){
    it("should return an element with static content", function(){
        assert.equal(louk('a~ b'),'<a>b</a>')
    })
    it("should return an attribute with static content", function(){
        assert.equal(louk('a\n:b~ c'),'<a b="c"></a>')
    })
    it("should return an attribute with dynamic content", function(){
        assert.equal(louk('a\n:b c'),'<a v-bind:b="c"></a>')
    })
    it("should return an element with a for statement", function(){
        assert.equal(louk('a\n:for b'),'<a v-for="b"></a>')
    })
    it("should return an element with a click binding", function(){
        assert.equal(louk('a\n:click b'),'<a v-on:click="b"></a>')
    })
})

describe("Louk Not Implemented", function(){
    it("should return an element with a click binding", function(){
        assert.equal(louk('a\n:if b'),'<a v-if="b"></a>')
    })
    it("should return a self-closing element", function(){
        assert.equal(louk('a|'),'<a />')
    })
    it("should return an href via shorthand", function(){
        assert.equal(louk('a\n@b'),'<a href="b"></a>')
    })
})
