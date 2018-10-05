var config = require("./config.js");
var dir = config.testTarget;
var file = config.file;

var louk = require(file("index.js"));

var chai = require("chai");
var assert = chai.assert;

var markunit = require("markunit");
var fs = require('fs');
var readme = markunit(fs.readFileSync("./README.md", "utf8"));

describe("README", function(){
    it("should contain at least one h1", function(){
        readme.markup.has("h1");
    });
    it("should contain at least one h2", function(){
        readme.markup.has("h2");
    });
    it("should not contain double-indented lists", function(){
        readme.markup.no("li li");
    });
    it("should not have any curly quotes in code snippets", function(){
        readme.code.no(["“","”"]);
    });
    it("should not have the library's name in lower-case form in the copy", function(){
        readme.copy.no("louk");
    });
    it("should contain installation instructions", function(){
        readme.code.has("npm install");
    });
});

describe("Louk", function(){
    it("should return correct values for documentation examples", function(){
        assert.equal(louk('h1\ndiv\n\tbr/'),'<h1></h1>\n<div>\n\t<br /></div>');
        assert.equal(louk('div string'),'<div>{{string}}</div>');
        assert.equal(louk('ul\n:class focus\n\tli\n\t-for item in items'),'<ul v-bind:class="focus">\n\t<li v-for="item in items"></li>\n</ul>');
        assert.equal(louk('p" Hello world!'),'<p>Hello world!</p>');
        assert.equal(louk('div save\n//Triggers dialog\n@click confirm'),'<div v-on:click="confirm">{{save}}</div>');
        assert.equal(louk('<div>\n\th1 title\n\t#title\n\t<!-- A comment --></div>'),'<div>\n\t<h1 id="title">{{title}}</h1>\n\t<!-- A comment --></div>');
    });
});
