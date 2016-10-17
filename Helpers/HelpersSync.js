/// <reference path="../../Scripts/typings/xrmpage/xrm.d.ts"/>
"use strict";
function syncDoubler(x) {
    return x * 2;
}
exports.syncDoubler = syncDoubler;
function syncTripler(x) {
    return x * 3;
}
exports.syncTripler = syncTripler;
exports.syncQuadrupler = function (x) {
    return x * 4;
};
console.log(syncDoubler(3));
//# sourceMappingURL=HelpersSync.js.map