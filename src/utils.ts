export default {
    clone,
};

function clone(input) {
    return JSON.parse(JSON.stringify(input));
}
