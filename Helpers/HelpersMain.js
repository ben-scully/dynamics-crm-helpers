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
//# sourceMappingURL=HelpersMain.js.map