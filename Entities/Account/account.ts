/// <reference path="../../Tools/Helpers/HelpersFields.ts" />

module Account {
    export function onload(context?: Xrm.Page.EventContext) {
        console.log("Account onload");
    }
    export function onsave(context?: Xrm.Page.EventContext) {
        console.log("Account onsave");
    }
}