/// <reference path="../Tools/Helpers/HelperMaster.ts" />

interface Entity {
    onload(context?: Xrm.Page.EventContext): void;
    onsave(context?: Xrm.Page.EventContext): void;
}


// abstract class Entity {
//    static onload(context?: Xrm.Page.EventContext): void {}
//    static onsave(context?: Xrm.Page.EventContext): void {}
// }


// interface Entity {
//     // onload(context?: Xrm.Page.EventContext): void;
//     // onsave(context?: Xrm.Page.EventContext): void;
// }
// interface Entity1 {
//     new(): Entity
//     onload(context?: Xrm.Page.EventContext): void;
//     onsave(context?: Xrm.Page.EventContext): void;
// }


// module Help {
//     var 
// }