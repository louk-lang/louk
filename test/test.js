const louk = require("../dist/index.js")
const chai = require("chai")
const assert = chai.assert

const markunit = require("markunit")
const fs = require('fs');
const readme = markunit(fs.readFileSync("./README.md", "utf8"))

describe("Louk", function(){
    it("should return a simple element", function(){
        assert.equal(louk('a'),'<a></a>')
    })
    it("should return a simple header element", function(){
        assert.equal(louk('h1'),'<h1></h1>')
    })
    it("should return a simple img element", function(){
        assert.equal(louk('img'),'<img></img>')
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
    it("should return an element with static content", function(){
        assert.equal(louk('a~ b'),'<a>b</a>')
    })
    it("should return a self-closing element", function(){
        assert.equal(louk('a/'),'<a />')
    })
    it("should return an attribute with dynamic content", function(){
        assert.equal(louk('a\n:b c'),'<a v-bind:b="c"></a>')
    })
    it("should return an attribute with static content", function(){
        assert.equal(louk('a\n~b c'),'<a b="c"></a>')
    })
    it("should return an element with a simple directive", function(){
        assert.equal(louk('a\n-if b'),'<a v-if="b"></a>')
    })
    it("should return an element with a boolean directive", function(){
        assert.equal(louk('a\n-b'),'<a v-b></a>')
    })
    it("should return an element with a for statement", function(){
        assert.equal(louk('a\n-for b'),'<a v-for="b"></a>')
    })
    it("should return an element with a click action directive", function(){
        assert.equal(louk('a\n@click b'),'<a v-on:click="b"></a>')
    })
    it("should return an element with a key action directive", function(){
        assert.equal(louk('a\n@keyup.enter b'),'<a v-on:keyup.enter="b"></a>')
    })
    it("should return an element with static URL", function(){
        assert.equal(louk('a\n>b'),'<a href="b"></a>')
    })
    it("should pass through HTML content", function(){
        assert.equal(louk('<a>b</a>'),'<a>b</a>')
    })
    it("should discard a comment", function(){
        assert.equal(louk('//a\nb'),'<b></b>')
    })
    it("should pass through multi-line HTML content", function(){
        assert.equal(louk('<a>\n<b></b>\n</a>'),'<a><b></b></a>')
    })
    it("should pass through HTML content with Louk content in it", function(){
        assert.equal(louk('<a>\n<b>\nc d\n</b></a>'),'<a><b><c>{{d}}</c></b></a>')
    })
    it("should pass through an HTML comment", function(){
        assert.equal(louk('a\n<!-- b -->\nc'),'<a></a><!-- b --><c></c>')
    })
    it("should return correct values for documentation examples", function(){
        assert.equal(louk('h1\ndiv\n\tbr/'),'<h1></h1><div><br /></div>')
        assert.equal(louk('div string'),'<div>{{string}}</div>')
        assert.equal(louk('ul\n:class focus\n\tli\n\t-for item in items'),'<ul v-bind:class="focus"><li v-for="item in items"></li></ul>')
        assert.equal(louk('p~ Hello world!'),'<p>Hello world!</p>')
        assert.equal(louk('div save\n//Triggers dialog\n@click confirm'),'<div v-on:click="confirm">{{save}}</div>')
        assert.equal(louk('<div>\n\th1 title\n\t#title\n\t<!-- A comment --></div>'),'<div><h1 id="title">{{title}}</h1><!-- A comment --></div>')
    })
})

describe("README", function(){
  it("should contain at least one h1", function(){
    readme.markup.has("h1")
  })
  it("should contain at least one h2", function(){
    readme.markup.has("h2")
  })
  it("should not contain double-indented lists", function(){
    readme.markup.no("li li")
  })
  it("should not have any curly quotes in code snippets", function(){
    readme.code.no(["“","”"])
  })
  it("should not have the library's name in lower-case form in the copy", function(){
    readme.copy.no("louk")
  })
  it("should contain installation instructions", function(){
    readme.code.has("npm install")
  })
})
