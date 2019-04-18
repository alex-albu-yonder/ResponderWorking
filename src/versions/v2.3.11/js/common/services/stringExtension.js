// ------------------------------------
// endsWith
// ------------------------------------
// Extension method on the String objects. Used to determine if the String ends with the given suffix
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
