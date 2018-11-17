var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index.js"));

var htmlGenerator = require(file("html-generator"));

describe("HTML Generator", function(){
    it("should generate simple HTML", function(){
        var input = [
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
        ];
        assert.equal(htmlGenerator.generateHTML(input), '<a></a>');
    });
    it("should generate HTML with multiple elements", function(){
        var input = [
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
            { key: 'a', position: 'closing' },
            {
                unindented: 'b',
                lineType: 'louk',
                crux: 'b',
                selfClosing: false,
                key: 'b',
                interpretation: 'dynamic',
                fill: '',
                directiveType: '',
                position: 'opening',
                attributes: {}
            },
            { key: 'b', position: 'closing' }
        ];
        assert.equal(htmlGenerator.generateHTML(input), '<a></a>\n<b></b>');
    });
    it("should generate HTML with an attribute", function(){
        var input = [
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
                attributes: {
                    class:{
                        data: "b",
                        key:"class",
                        interpretation:"static"
                    }
                }
            },
            { key: 'a', position: 'closing' }
        ];
        assert.equal(htmlGenerator.generateHTML(input), '<a class="b"></a>');
    });
    it("should follow a self-closing element with a newline", function(){
        var input = [
            {
                unindented: 'img',
                lineType: 'louk',
                crux: 'img',
                selfClosing: true,
                key: 'img',
                interpretation: 'static',
                fill: '',
                directiveType: '',
                position: 'opening',
            },
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
            },
            { key: 'a', position: 'closing' }
        ];
        assert.equal(htmlGenerator.generateHTML(input, {keepWhitespace: true}), '<img />\n<a></a>');
    });
});
