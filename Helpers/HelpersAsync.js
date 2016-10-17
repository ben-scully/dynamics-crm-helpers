/// <reference path="../../Scripts/typings/xrmpage/xrm.d.ts"/>
"use strict";
function asyncDoubler(x) {
    return x * 2;
}
exports.asyncDoubler = asyncDoubler;
function asyncTripler(x) {
    return x * 3;
}
exports.asyncTripler = asyncTripler;
exports.asyncQuadrupler = function (x) {
    return x * 4;
};
console.log(asyncDoubler(3));
//# sourceMappingURL=HelpersAsync.js.map