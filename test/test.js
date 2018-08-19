const louk = require("../louk.js")
const chai = require("chai")
const assert = chai.assert

describe("Louk", function(){
    it("should return a simple element", function(){
        assert.equal(louk("a"),"<a></a>")
    })
    it("should return two peer elements", function(){
        assert.equal(louk("a\nb"),"<a></a><b></b>")
    })
    it("should return a nested element", function(){
        assert.equal(louk("a\n\tb"),"<a><b></b></a>")
    })
    it("should return a simple element when indented", function(){
        assert.equal(louk("\ta"),"<a></a>")
    })
})
