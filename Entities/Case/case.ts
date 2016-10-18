/// <reference path="../Entity-Interface.d.ts" />
/// <reference path="../../Tools/Helpers/HelpersFields.ts" />

class Contact implements Entity {
    onload(context?: Xrm.Page.EventContext) {
        console.log("instance onload");
        Contact.onload();
    }
    onsave(context?: Xrm.Page.EventContext) {
        console.log("instance onsave");
        Contact.onsave();

    }
    static onload(context?: Xrm.Page.EventContext): void {
        console.log("static onload");
    }
    static onsave(context?: Xrm.Page.EventContext): void {
        console.log("static onsave");
    }
}