var testTarget = "../src/";

// Ensure CI system always runs against distribution
if(process.env.CI){
    testTarget = "../dist/";
}

function file(path) { return testTarget + path;}

module.exports = {
    testTarget: testTarget,
    file: file
};
