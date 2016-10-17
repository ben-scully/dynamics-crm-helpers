/// <reference path="../../Scripts/typings/xrmpage/xrm.d.ts"/>

export function asyncDoubler(x) {
    return x * 2;
}

export function asyncTripler(x) {
    return x * 3;
}

export var asyncQuadrupler = x => {
    return x * 4;
}

console.log(asyncDoubler(3));