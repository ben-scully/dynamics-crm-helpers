/// <reference path="../../Tools/Helpers/HelpersFields.ts" />

module Case {
    export function onload(context?: Xrm.Page.EventContext) {
        console.log("Case onload");
    }
    export function onsave(context?: Xrm.Page.EventContext) {
        console.log("Case onsave");
    }
}
