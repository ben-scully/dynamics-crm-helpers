/// <reference path="../../Scripts/typings/xrmpage/xrm.d.ts"/>

export function fieldsDoubler(x) {
    return x * 2;
}

export function fieldsTripler(x) {
    return x * 3;
}

export var fieldsQuadrupler = x => {
    return x * 4;
}

console.log(fieldsDoubler(3));