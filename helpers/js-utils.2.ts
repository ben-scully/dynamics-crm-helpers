/// <reference path="js-utils.ts" />

namespace Help {
    export const getControl = (attribute: string) => {
        var ctrl = Xrm.Page.getControl(attribute);
        if (ctrl)
            return ctrl;
        if (DEBUG)
            throw "Control not on the form: " + attribute;
    }

}