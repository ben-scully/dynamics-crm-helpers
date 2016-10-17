/// <reference path="../../Scripts/typings/xrmpage/xrm.d.ts"/>
"use strict";
function fieldsDoubler(x) {
    return x * 2;
}
exports.fieldsDoubler = fieldsDoubler;
function fieldsTripler(x) {
    return x * 3;
}
exports.fieldsTripler = fieldsTripler;
exports.fieldsQuadrupler = function (x) {
    return x * 4;
};
console.log(fieldsDoubler(3));
//# sourceMappingURL=HelpersFields.js.map