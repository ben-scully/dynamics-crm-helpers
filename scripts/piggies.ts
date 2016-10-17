/// <reference path="../helpers/js-utils.1.ts" />
/// <reference path="../helpers/js-mods.ts" />
// import * as pig from 'js-utils.1';
// import help = Help;
import {onload} from "js-mods";

module Piggies {
    export const OnLoad = (context: Xrm.Context) => {
        console.log(missPiggy);
    }

    const missPiggy = { name: "Miss Piggy" };
    Help.getAttribute("");
}