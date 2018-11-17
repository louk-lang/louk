var testTarget = "../src/";

var chai = require("chai");
var assert = chai.assert;

// Ensure CI system always runs against distribution
if(process.env.CI){
    testTarget = "../dist/";
}

function file(path) { return testTarget + path;}

module.exports = {
    testTarget: testTarget,
    file: file,
    assert: assert
};
