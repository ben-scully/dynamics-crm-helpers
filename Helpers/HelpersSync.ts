/// <reference path="../../Scripts/typings/xrmpage/xrm.d.ts"/>

export function syncDoubler (x) {
    return x * 2;
}

export function syncTripler (x) {
    return x * 3;
}

export const syncQuadrupler = x => {
    return x * 4;
}

console.log(syncDoubler(3));