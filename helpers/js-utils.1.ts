/// <reference path="js-utils.ts" />

module Help {
    
    // const test;
    export const getAttribute = (attribute: string) => {
        var attr = Xrm.Page.getAttribute(attribute);
        if (attr)
            return attr;
        if (DEBUG)
            throw "Attribute not on the form: " + attribute;
    }
    
    // export const getLookup = (attribute: string) => {
    //     var attr = Xrm.Page.getAttribute<Xrm.Page.LookupAttribute>(attribute);
    //     if (attr) {
    //         let value = attr.getValue();
    //         if (value !== null && value.length > 0)
    //             return attr.getValue()[0];
    //         return null;
    //     }
    //     if (DEBUG)
    //         throw "Attribute not on the form: " + attribute;
    // }
    
    // export const getString = (attribute: string) => {
    //     var attr = Xrm.Page.getAttribute<Xrm.Page.StringAttribute>(attribute);
    //     if (attr)
    //         return attr.getValue();
    //     if (DEBUG)
    //         throw "Attribute not on the form: " + attribute;
    // }
    
    // export const getNumber = (attribute: string) => {
    //     var attr = Xrm.Page.getAttribute<Xrm.Page.NumberAttribute>(attribute);
    //     if (attr)
    //         return attr.getValue();
    //     if (DEBUG)
    //         throw "Attribute not on the form: " + attribute;
    // }
    
    // export const getOptionSetValue = (attribute: string) => {
    //     var attr = Xrm.Page.getAttribute<Xrm.Page.OptionSetAttribute>(attribute);
    //     if (attr)
    //         return attr.getValue();
    //     if (DEBUG)
    //         throw "Attribute not on the form: " + attribute;
    // }
    
    // export const getOptionSetText = (attribute: string) => {
    //     var attr = Xrm.Page.getAttribute<Xrm.Page.OptionSetAttribute>(attribute);
    //     if (attr)
    //         return attr.getText();
    //     if (DEBUG)
    //         throw "Attribute not on the form: " + attribute;
    // }
    
    // export const getBoolean = (attribute: string) => {
    //     var attr = Xrm.Page.getAttribute<Xrm.Page.BooleanAttribute>(attribute);
    //     if (attr)
    //         return attr.getValue();
    //     if (DEBUG)
    //         throw "Attribute not on the form: " + attribute;
    // }
}