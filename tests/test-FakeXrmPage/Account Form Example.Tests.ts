/*
 * Project Source: https://fakexrmpage.codeplex.com
 * Authors: Patrick Verbeeten
 * Version: 1.0
 * Date: 2014-06-25
 */

/* *****************************************************************************
Copyright (c) Patrick Verbeeten (PatrickVerbeeten.com). All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/// <reference path="../../FakeXrmPage/Account Form Example.ts" />
/// <reference path="../../FakeXrmPage/FakeXrmPage.ts" />
/// <reference path="../../typings/jasmine/jasmine.d.ts" />

var JasmineTests = require("jasmine");

/** Define the test cases
 * The JasmineTests based class defined in Jasmine.Typed automatically executes each method which starts with 'test_'
  */
class AccountFormScriptTests extends JasmineTests {
    suiteName: string = 'Account Form Example';

    test_executeOnload_Create() {
        //Step 1: Setup environment
        var xrm = Fakes.loadXrmPageSolution('account');

        var target = new AccountFormScript(xrm);

        //Step 2: Call the test target
        target.onload();

        //Step 3: Verify the result
        expect(xrm.Page.getAttribute<Xrm.Page.StringAttribute>('name').getValue()).toEqual('Default Name');
    }

    test_executeOnload_UpdateNoValue() {
        //Step 1: Setup environment
        var options = new Fakes.FormOptions();
        options.FormType = 2; //Update form
        var xrm = Fakes.loadXrmPageSolution('account', options);

        var target = new AccountFormScript(xrm);

        //Step 2: Call the test target
        target.onload();

        //Step 3: Verify the result
        expect(xrm.Page.getAttribute<Xrm.Page.StringAttribute>('name').getValue()).toEqual('Default Name');
    }

    test_executeOnload_UpdateExistingValue() {
        //Step 1: Setup environment
        var options = new Fakes.FormOptions();
        options.FormType = 2; //Update form
        options.Values['name'] = 'Existing';
        var xrm = Fakes.loadXrmPageSolution('account', options);

        var target = new AccountFormScript(xrm);

        //Step 2: Call the test target
        target.onload();

        //Step 3: Verify the result
        expect(xrm.Page.getAttribute<Xrm.Page.StringAttribute>('name').getValue()).toEqual('Existing');
    }

}

new AccountFormScriptTests().run();