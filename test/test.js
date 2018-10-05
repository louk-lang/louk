//Can use src or dist
const dir = "../src/"

function file(path) { return dir + path;}

const louk = require(file("index.js"))
const chai = require("chai")
const assert = chai.assert

const markunit = require("markunit")
const fs = require('fs');
const readme = markunit(fs.readFileSync("./README.md", "utf8"))

const patterns = require(file("patterns"))
const lineProcessor = require(file("line-processor"))
const sectionProcessor = require(file("section-processor"))
const elementProcessor = require(file("element-processor"))
const propertyDeterminer = require(file("property-determiner"))
const htmlGenerator = require(file("html-generator"))

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
        assert.equal(louk('a\nb'),'<a></a>\n<b></b>')
    })
    it("should return two peer elements without whitespace", function(){
        assert.equal(louk('a\nb',{whitespace:false}),'<a></a><b></b>')
    })
    it("should return a nested element", function(){
        assert.equal(louk('a\n\tb'),'<a>\n\t<b></b>\n</a>')
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
        assert.equal(louk('a\n\tb\nc\n\td'),'<a>\n\t<b></b>\n</a>\n<c>\n\t<d></d>\n</c>')
    })
    it("should return two peer nested elements without whitespace", function(){
        assert.equal(louk('a\n\tb\nc\n\td',{whitespace:false}),'<a><b></b></a><c><d></d></c>')
    })
    it("should return a double nested element", function(){
        assert.equal(louk('a\n\tb\n\t\tc'),'<a>\n\t<b>\n\t\t<c></c>\n\t</b>\n</a>')
    })
    it("should return a double nested element with a trailing line", function(){
        assert.equal(louk('a\n\tb\n\t\tc\n'),'<a>\n\t<b>\n\t\t<c></c>\n\t</b>\n</a>')
    })
    it("should return a double nested element without whitespace", function(){
        assert.equal(louk('a\n\tb\n\t\tc',{whitespace:false}),'<a><b><c></c></b></a>')
    })
    it("should handle multiple consecutive closures", function(){
        assert.equal(louk('a\n\tb\n\t\tc\nd'),'<a>\n\t<b>\n\t\t<c></c>\n\t</b>\n</a>\n<d></d>')
    })
    it("should return an element with static content", function(){
        assert.equal(louk('a" b'),'<a>b</a>')
    })
    it("should return a self-closing element", function(){
        assert.equal(louk('a/'),'<a />')
    })
    it("should return an attribute with dynamic content", function(){
        assert.equal(louk('a\n:b c'),'<a v-bind:b="c"></a>')
    })
    it("should return a boolean attribute", function(){
        assert.equal(louk('a\n"b'),'<a b></a>')
    })
    it("should return an attribute with static content", function(){
        assert.equal(louk('a\n"b c'),'<a b="c"></a>')
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
        assert.equal(louk('<a>\n<b></b>\n</a>'),'<a>\n<b></b>\n</a>')
    })
    it("should pass through HTML content with Louk content in it", function(){
        assert.equal(louk('<a>\n<b>\nc d\n</b></a>'),'<a>\n<b>\n<c>{{d}}</c>\n</b></a>')
    })
    it("should pass through an HTML comment", function(){
        assert.equal(louk('a\n<!-- b -->\nc'),'<a></a>\n<!-- b -->\n<c></c>')
    })
    it("should pass through an HTML comment without whitespace", function(){
        assert.equal(louk('a\n<!-- b -->\nc',{whitespace:false}),'<a></a><!-- b --><c></c>')
    })
    it("should process louk section content", function(){
        assert.equal(louk("template,\n\ta b\n\t.c"), '<template>\n\t<a class="c">{{b}}</a>\n</template>')
    })
    it("should pass through non-louk section content", function(){
        assert.equal(louk("script,\n\tfunction(x){return x}"), '<script>\n\tfunction(x){return x}\n</script>')
    })
    it("should handle multiple lines of non-louk section content", function(){
        assert.equal(louk("script,\n\tfunction(x){\n\t\treturn x\n\t}"), '<script>\n\tfunction(x){\n\t\treturn x\n\t}\n</script>')
    })
    it("should pass through multiple non-louk sections' content", function(){
        assert.equal(louk("script,\n\tfunction(x){return x}\nstyle,\n\t*{color:green}"), '<script>\n\tfunction(x){return x}\n</script>\n<style>\n\t*{color:green}\n</style>')
    })
    it("should handle mix of louk and non-louk sections' content", function(){
        assert.equal(louk("template,\n\tdiv string\nscript,\n\tfunction(x){return x}\nstyle,\n\t*{color:green}"), '<template>\n\t<div>{{string}}</div>\n</template>\n<script>\n\tfunction(x){return x}\n</script>\n<style>\n\t*{color:green}\n</style>')
    })
    it("should remove excess leading and trailing whitespace in non-Louk section", function(){
        assert.equal(louk("script,\n\n\tfunction(x){\n\t\treturn x\n\t}\n"), '<script>\n\tfunction(x){\n\t\treturn x\n\t}\n</script>')
    })
    it("should handle an uncontained element before a marked section", function(){
        assert.equal(louk("a\ntemplate,"), '<a></a>\n<template></template>')
    })
    it("should handle multiple uncontained elements before a marked section", function(){
        assert.equal(louk("a\n\tb\ntemplate,"), '<a>\n\t<b></b>\n</a>\n<template></template>')
    })
    it("should handle an uncontained comment before a marked section", function(){
        assert.equal(louk("<!--Comment-->\ntemplate,"), '<!--Comment-->\n<template></template>')
    })
    it("should set the language per section", function(){
        const options = {
            langs: { style: "stylus" }
        }
        assert.equal(louk('style,',options),'<style lang="stylus">\n\n</style>')
    })
    it("should not override an explicitly set section language", function(){
        const options = {
            langs: { style: "stylus" }
        }
        assert.equal(louk('style,\n"lang sass',options),'<style lang="sass">\n\n</style>')
    })
    it("should return correct values for documentation examples", function(){
        assert.equal(louk('h1\ndiv\n\tbr/'),'<h1></h1>\n<div>\n\t<br /></div>')
        assert.equal(louk('div string'),'<div>{{string}}</div>')
        assert.equal(louk('ul\n:class focus\n\tli\n\t-for item in items'),'<ul v-bind:class="focus">\n\t<li v-for="item in items"></li>\n</ul>')
        assert.equal(louk('p" Hello world!'),'<p>Hello world!</p>')
        assert.equal(louk('div save\n//Triggers dialog\n@click confirm'),'<div v-on:click="confirm">{{save}}</div>')
        assert.equal(louk('<div>\n\th1 title\n\t#title\n\t<!-- A comment --></div>'),'<div>\n\t<h1 id="title">{{title}}</h1>\n\t<!-- A comment --></div>')
    })
})

describe("Patterns", function(){
    it("should be defined", function(){
        assert.equal(typeof(patterns), "object")
        assert.notEqual(patterns, {})
    })
})

describe("Line Processor", function(){
    it("should delete comments", function(){
        const input = [
            { raw: '//a',
                lineType: 'comment'
            },
            {
                raw: 'b',
                lineType: 'louk'
            }
        ]
        assert.equal(lineProcessor.deleteComments(input).length, 1)
    })
})

describe("Section processor", function(){
    it("should find a section marker", function(){
        assert.equal(sectionProcessor.findSections(["template,"]).length, 1)
    })
    it("should identify a louk template section", function(){
        assert.equal(sectionProcessor.findSections(["template,"])[0].isLouk, true)
    })
    it("should find a section marker attribute", function(){
        assert.equal(sectionProcessor.findSections(["layout,",'"lang louk'])[0].isLouk, true)
    })
    it("should identify a non-louk section", function(){
        assert.equal(sectionProcessor.findSections(["script,"])[0].isLouk, false)
    })
    it("should identify multiple sections", function(){
        assert.equal(sectionProcessor.findSections(["template,","script,"]).length, 2)
    })
    it("should identify the body of a section", function(){
        assert.equal(sectionProcessor.findSections(["template,",'\t"a'])[0].body.lines[0], '\t"a')
    })
})

describe("Element Processor", function(){
    it("should assign a closing tag", function(){
        const input = [
            {
                classification: 'tag',
                key: 'a',
                preceding: []
            }
        ]
        assert.equal(elementProcessor.assignMatches(input).length, 2)
    })
})

describe("Property Determiner", function(){
    it("should identify line types", function(){
        assert.equal(propertyDeterminer.determineLineType({ unindented: '<a>' }), 'html')
        assert.equal(propertyDeterminer.determineLineType({ unindented: '//b' }), 'comment')
        assert.equal(propertyDeterminer.determineLineType({ unindented: 'c' }), 'louk')
    })
})

describe("HTML Generator", function(){
    it("should generate HTML", function(){
        const input = [
            {
                unindented: 'a',
                lineType: 'louk',
                crux: 'a',
                selfClosing: false,
                key: 'a',
                interpretation: 'dynamic',
                fill: '',
                directiveType: '',
                position: 'opening',
                attributes: {}
            },
            { key: 'a', position: 'closing' }
        ]
        assert.equal(htmlGenerator.generateHTML(input), '<a></a>')
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
