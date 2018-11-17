var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index.js"));

var markunit = require("markunit");
var fs = require('fs');
var readme = markunit(fs.readFileSync("./README.md", "utf8"));

describe("Louk (sections)", function(){
    it("should handle a top-level element next to a Vue section", function(){
        assert.equal(louk('template,\ndiv'),'<template></template>\n<div></div>');
    });
    it("should remove a line with only whitespace", function(){
        assert.equal(louk('template,\n '),'<template></template>');
    });
    it("should process louk section content", function(){
        assert.equal(louk("template,\n\ta b\n\t.c"), '<template>\n\t<a class="c">{{b}}</a>\n</template>');
    });
    it("should pass through non-louk section content", function(){
        assert.equal(louk("script,\n\tfunction(x){return x}"), '<script>\n\tfunction(x){return x}\n</script>');
    });
    it("should handle multiple lines of non-louk section content", function(){
        assert.equal(louk("script,\n\tfunction(x){\n\t\treturn x\n\t}"), '<script>\n\tfunction(x){\n\t\treturn x\n\t}\n</script>');
    });
    it("should pass through multiple non-louk sections' content", function(){
        assert.equal(louk("script,\n\tfunction(x){return x}\nstyle,\n\t*{color:green}"), '<script>\n\tfunction(x){return x}\n</script>\n<style>\n\t*{color:green}\n</style>');
    });
    it("should handle mix of louk and non-louk sections' content", function(){
        assert.equal(louk("template,\n\tdiv string\nscript,\n\tfunction(x){return x}\nstyle,\n\t*{color:green}"), '<template>\n\t<div>{{string}}</div>\n</template>\n<script>\n\tfunction(x){return x}\n</script>\n<style>\n\t*{color:green}\n</style>');
    });
    it("should remove excess leading and trailing whitespace in non-Louk section", function(){
        assert.equal(louk("script,\n\n\tfunction(x){\n\t\treturn x\n\t}\n"), '<script>\n\tfunction(x){\n\t\treturn x\n\t}\n</script>');
    });
    it("should handle an uncontained element before a marked section", function(){
        assert.equal(louk("a\ntemplate,"), '<a></a>\n<template></template>');
    });
    it("should handle multiple uncontained elements before a marked section", function(){
        assert.equal(louk("a\n\tb\ntemplate,"), '<a>\n\t<b></b>\n</a>\n<template></template>');
    });
    it("should handle an uncontained comment before a marked section", function(){
        assert.equal(louk("<!--Comment-->\ntemplate,"), '<!--Comment-->\n<template></template>');
    });
    it("should set the language per section", function(){
        var options = {
            langs: { style: "stylus" }
        };
        assert.equal(louk('style,',options),'<style lang="stylus">\n\n</style>');
    });
    it("should not override an explicitly set section language", function(){
        var options = {
            langs: { style: "stylus" }
        };
        assert.equal(louk('style,\n\'lang sass',options),'<style lang="sass">\n\n</style>');
    });
    it("should handle a non-Louk template section", function(){
        assert.equal(louk('template,\n\'lang loukxyz\n\ta'),'<template lang="loukxyz">\n\ta\n</template>');
    });
});
