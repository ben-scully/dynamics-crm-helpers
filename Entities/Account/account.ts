/// <reference path="../Entity-Interface.d.ts" />
/// <reference path="../../Tools/Helpers/HelpersFields.ts" />

module Account {
    export function onload(context?: Xrm.Page.EventContext) {
        console.log("instance onload");
    }
    export function onsave(context?: Xrm.Page.EventContext) {
        console.log("instance onsave");
    }
}