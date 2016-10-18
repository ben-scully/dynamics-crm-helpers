/// <reference path="../Entity-Interface.d.ts" />
/// <reference path="../../Tools/Helpers/HelpersFields.ts" />

class Account implements Entity {
    onload(context?: Xrm.Page.EventContext) {
        console.log("instance onload");
        Account.onload();
    }
    onsave(context?: Xrm.Page.EventContext) {
        console.log("instance onsave");
        Account.onsave();

    }
    static onload(context?: Xrm.Page.EventContext): void {
        console.log("static onload");
    }
    static onsave(context?: Xrm.Page.EventContext): void {
        console.log("static onsave");
    }
}