/// <reference path="../Entity-Interface.d.ts" />
/// <reference path="../../Tools/Helpers/HelpersFields.ts" />

namespace Contact {
    export const onload = (context?: Xrm.Page.EventContext) => {
        console.log("Contact onload");
        bob();
    }
    export const onsave = (context?: Xrm.Page.EventContext) => {
        console.log("Contact onsave");
    }

    function bob() {

    }
}
