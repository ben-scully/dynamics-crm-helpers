/// <reference path="../Entity-Interface.d.ts" />
/// <reference path="../../Tools/Helpers/HelpersFields.ts" />

namespace Case {
    export function onload(context?: Xrm.Page.EventContext) {
        console.log("Case onload");
    }
    export function onsave(context?: Xrm.Page.EventContext) {
        console.log("Case onsave");
    }
    
    function bob() {

    }
}
