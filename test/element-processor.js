var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index"));

var elementProcessor = require(file("element-processor"));

describe("Element Processor", function(){
    it("assignAttributes", function(){
        var input = [
        { raw: 'div',
          line: 0,
          whitespace: '',
          indent: 0,
          unindented: 'div',
          lineType: 'louk',
          crux: 'div',
          prefix: undefined,
          classification: 'tag',
          key: 'div',
          interpretation: 'dynamic',
          preceding: [] },
        { raw: '-cloak',
          line: 1,
          whitespace: '',
          indent: 0,
          unindented: '-cloak',
          lineType: 'louk',
          crux: '-cloak',
          prefix: '-',
          classification: 'attribute',
          key: 'cloak',
          interpretation: 'dynamic',
          directiveType: 'simple',
          preceding: [] }
      ];
      assert.equal(elementProcessor.assignAttributes(input)[0].attributes.cloak.directiveType,"simple");
    });
    it("should assign a closing tag", function(){
        var input = [
            {
                classification: 'tag',
                key: 'a',
                preceding: []
            }
        ];
        assert.equal(elementProcessor.assignMatches(input).length, 2);
    });
    it("should mark the last element as not containing any elements", function(){
        var input = [{},{}];
        var processedElements = elementProcessor.assignMatches(input);
        assert.equal(processedElements[processedElements.length-1].containsElement, false);
    });
    it("should insert matches", function(){
        var input = [
          { raw: 'a',
            line: 0,
            whitespace: '',
            indent: 0,
            unindented: 'a',
            lineType: 'louk',
            crux: 'a',
            prefix: undefined,
            suffix: null,
            selfClosing: false,
            classification: 'tag',
            key: 'a',
            interpretation: 'dynamic',
            fill: null,
            directiveType: undefined,
            preceding: [],
            position: 'opening',
            matched: false,
            attributes: {} },
          { raw: 'b',
            line: 1,
            whitespace: '',
            indent: 0,
            unindented: 'b',
            lineType: 'louk',
            crux: 'b',
            prefix: undefined,
            suffix: null,
            selfClosing: false,
            classification: 'tag',
            key: 'b',
            interpretation: 'dynamic',
            fill: null,
            directiveType: undefined,
            preceding: [ [] ],
            position: 'opening',
            matched: false,
            attributes: {} },
          { preceding: [ [] ],
            system: 'end',
            containsElement: false } ];
            assert.equal(elementProcessor.insertMatches(input).length, 4);
        });
    it("should assign the closing tag attribute", function(){
        assert.equal(elementProcessor.closingTag({}).position, "closing");
    });
    it("should identify an element that contains another element", function(){
        var input = [
        { raw: 'div',
          line: 0,
          whitespace: '',
          indent: 0,
          unindented: 'div',
          lineType: 'louk',
          crux: 'div',
          prefix: null,
          classification: 'tag',
          containsElement: false,
          key: 'div',
          interpretation: 'dynamic',
          preceding: [] },
        { raw: 'div',
          line: 1,
          whitespace: '\t',
          indent: 1,
          unindented: 'div',
          lineType: 'louk',
          crux: 'div',
          prefix: null,
          classification: 'tag',
          containsElement: false,
          key: 'div',
          interpretation: 'dynamic',
          preceding: [] }
      ];
      var processedElements = elementProcessor.assignMatches(input);
      assert.equal(processedElements[1].containsElement, false);
      assert.equal(processedElements[0].containsElement, true);
      });
      it("should identify an element that contains another element with a continuation", function(){
          var input = [
          { raw: 'div',
            line: 0,
            whitespace: '',
            indent: 0,
            unindented: 'div',
            lineType: 'louk',
            crux: 'div',
            prefix: null,
            classification: 'tag',
            containsElement: false,
            key: 'div',
            interpretation: 'dynamic',
            preceding: [] },
          { raw: '| abc',
            line: 1,
            whitespace: '',
            indent: 0,
            unindented: '|',
            lineType: 'louk',
            crux: '|',
            prefix: null,
            classification: 'continuation',
            containsElement: false,
            key: '|',
            interpretation: 'dynamic',
            preceding: [] },
          { raw: 'div',
            line: 2,
            whitespace: '\t',
            indent: 1,
            unindented: 'div',
            lineType: 'louk',
            crux: 'div',
            prefix: null,
            classification: 'tag',
            containsElement: false,
            key: 'div',
            interpretation: 'dynamic',
            preceding: [] }
        ];
        var processedElements = elementProcessor.assignMatches(input);
        assert.equal(processedElements[2].containsElement, false);
        assert.equal(processedElements[0].containsElement, true);
        });
        it("should identify an element that doesn't contain another element", function(){
            var input = [
            { raw: 'div',
              line: 0,
              whitespace: '\t',
              indent: 1,
              unindented: 'div',
              lineType: 'louk',
              crux: 'div',
              prefix: null,
              classification: 'tag',
              containsElement: false,
              key: 'div',
              interpretation: 'dynamic',
              preceding: [] },
            { raw: 'div',
              line: 1,
              whitespace: '',
              indent: 0,
              unindented: 'div',
              lineType: 'louk',
              crux: 'div',
              prefix: null,
              classification: 'tag',
              containsElement: false,
              key: 'div',
              interpretation: 'dynamic',
              preceding: [] }
          ];
          var processedElements = elementProcessor.assignMatches(input);
          assert.equal(processedElements[1].containsElement, false);
          assert.equal(processedElements[0].containsElement, false);
          });
});
