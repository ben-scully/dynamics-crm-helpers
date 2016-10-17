/// <reference path="../typings/node-0.10.d.ts" />
/// <reference path="../typings/xrm-8.0.d.ts" />
"use strict";
var DEBUG = false;
/// <reference path="js-utils.ts" />
var Help;
(function (Help) {
    Help.getControl = function (attribute) {
        var ctrl = Xrm.Page.getControl(attribute);
        if (ctrl)
            return ctrl;
        if (DEBUG)
            throw "Control not on the form: " + attribute;
    };
})(Help || (Help = {}));
/// <reference path="js-utils.ts" />
var Help;
(function (Help) {
    // const test;
    Help.getAttribute = function (attribute) {
        var attr = Xrm.Page.getAttribute(attribute);
        if (attr)
            return attr;
        if (DEBUG)
            throw "Attribute not on the form: " + attribute;
    };
})(Help || (Help = {}));
/// <reference path="../helpers/js-utils.1.ts" />
// import * as pig from 'js-utils.1';
// import help = Help;
var Piggies;
(function (Piggies) {
    Piggies.OnLoad = function (context) {
        console.log(missPiggy);
    };
    var missPiggy = { name: "Miss Piggy" };
    Help.getAttribute("");
})(Piggies || (Piggies = {}));
