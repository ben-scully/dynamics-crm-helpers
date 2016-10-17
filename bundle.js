(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../../Scripts/typings/xrmpage/xrm.d.ts"/>
"use strict";
function asyncDoubler(x) {
    return x * 2;
}
exports.asyncDoubler = asyncDoubler;
function asyncTripler(x) {
    return x * 3;
}
exports.asyncTripler = asyncTripler;
exports.asyncQuadrupler = function (x) {
    return x * 4;
};
console.log(asyncDoubler(3));

},{}],2:[function(require,module,exports){
/// <reference path="../../Scripts/typings/xrmpage/xrm.d.ts"/>
"use strict";
function fieldsDoubler(x) {
    return x * 2;
}
exports.fieldsDoubler = fieldsDoubler;
function fieldsTripler(x) {
    return x * 3;
}
exports.fieldsTripler = fieldsTripler;
exports.fieldsQuadrupler = function (x) {
    return x * 4;
};
console.log(fieldsDoubler(3));

},{}],3:[function(require,module,exports){
"use strict";
var Sync = require('./HelpersSync');
var Async = require('./HelpersAsync');
var Fields = require('./HelpersFields');
var help = {};
for (var i in Sync) {
    help[i] = Sync[i];
}
for (var i in Async) {
    help[i] = Async[i];
}
for (var i in Fields) {
    help[i] = Fields[i];
}
console.log("Help-a-rooney", help);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = help;

},{"./HelpersAsync":1,"./HelpersFields":2,"./HelpersSync":4}],4:[function(require,module,exports){
/// <reference path="../../Scripts/typings/xrmpage/xrm.d.ts"/>
"use strict";
function syncDoubler(x) {
    return x * 2;
}
exports.syncDoubler = syncDoubler;
function syncTripler(x) {
    return x * 3;
}
exports.syncTripler = syncTripler;
exports.syncQuadrupler = function (x) {
    return x * 4;
};
console.log(syncDoubler(3));

},{}]},{},[3]);
