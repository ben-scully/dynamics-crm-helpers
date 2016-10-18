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

/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/xrmpage/xrm.d.ts" />

/** Example form script */
class AccountFormScript {
    private Xrm: Xrm.XrmStatic;
    constructor(xrm: Xrm.XrmStatic) {
        this.Xrm = xrm;
    }

    onload() {
        if (this.Xrm.Page.ui.getFormType() == 1
            || (this.Xrm.Page.ui.getFormType() == 2 && this.Xrm.Page.getAttribute<Xrm.Page.StringAttribute>('name').getValue() == null)
            ) {

            this.Xrm.Page.getAttribute<Xrm.Page.StringAttribute>('name').setValue('Default name');
        }
    }
}

/** Create an instance to use in the CRM form 
 * In the form configuration configure the library to call 'accountFormScriptInstance.onload'
 */
if (typeof Xrm != 'undefined')
    var accountFormScriptInstance = new AccountFormScript(Xrm);