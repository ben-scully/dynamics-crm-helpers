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

class FakeXrmPageTest extends JasmineTests {
    constructor() {
        super();
        this.suiteName = 'Fake XrmPage';
    }

    /** Example using the customizations file 
     * This is the basic operation of the Fake XrmPage object. It loads all information from a customizations.xml file.
     * The customizations file needs to be extracted from an unmanaged solution exported from CRM. This solution needs 
     * to contain all entities that are being tested against.
     * Using the customizations file not only ensures all metadata is correct it also ensures presence of controls etc.
     */
    test_usingCustomizationFile() {
        //Load the Xrm Page object. In this example the account form is loaded.
        var xrm = Fakes.loadXrmPageSolution('account');

        //The model is not behaving as if the would on the CRM form.
        var attribute = xrm.Page.getAttribute('name');
        expect(attribute).toBeDefined();
        expect(attribute).not.toBeNull();
        expect(attribute.getName()).toEqual('name');

        //The controls including sections and tabs are also available
        var control = xrm.Page.getControl('name');
        expect(control).toBeDefined();
        expect(control).not.toBeNull();
        expect(control.getLabel()).toEqual('Account Name');
        expect(control.getDisabled()).toEqual(false);
    }

    /** Example using a simple object definition instead of the customizations xml 
     * This can be usefull to run simple tests without the need for the customization file.
     */
    test_usingObjectDefinition() {
        //Load the Xrm page object. In this example only two attributes are defined
        var definition = new Fakes.FormDefinition();
        definition.Attributes.push(new Fakes.AttributeDefinition('attribute1'));
        definition.Attributes.push(new Fakes.AttributeDefinition('attribute2'));

        var xrm = Fakes.loadXrmPage(definition);

        //The defined model is now available
        var attribute = xrm.Page.getAttribute('attribute1');
        expect(attribute).toBeDefined();
        expect(attribute).not.toBeNull();
        expect(attribute.getName()).toBe('attribute1');
    }

    /** The object definition can also specify controls */
    test_usingObjectDefitionsWithControls() {
        //Load the Xrm page object. In this example only two attributes are defined
        var definition = new Fakes.FormDefinition();
        definition.Attributes.push(new Fakes.AttributeDefinition('attribute1'));
        definition.Attributes.push(new Fakes.AttributeDefinition('attribute2'));
        definition.Tabs.push(new Fakes.TabDefinition('tab1', [
            new Fakes.SectionDefinition('section1', [
                new Fakes.ControlDefinition('attribute1'),
                new Fakes.ControlDefinition('attribute2')
            ])
        ]));
        var xrm = Fakes.loadXrmPage(definition);

        //The defined model is now available
        var attribute = xrm.Page.getControl('attribute1');
        expect(attribute).toBeDefined();
        expect(attribute).not.toBeNull();
        expect(attribute.getName()).toBe('attribute1');
    }

    /** The form options can be specified to control aspects of the form such as form type, language and default values. */
    test_formOptions() {
        var options = new Fakes.FormOptions();
        options.FormType = 2; //Specify an update form
        options.Values['name'] = 'ACME'; //set the value for a field
        
        var xrm = Fakes.loadXrmPageSolution('account', options);

        expect(xrm.Page.ui.getFormType()).toEqual(2);

        var attribute = xrm.Page.getAttribute('name');
        expect(attribute.getValue()).toEqual('ACME');
        expect(attribute.getIsDirty()).toEqual(false);
    }
    /* 
     * Regardless of the method used to load the XrmPage object the behaviour is the same 
     */

    /** Get and set an attribute value */
    test_attributeValue() {
        var xrm = Fakes.loadXrmPageSolution('account');

        xrm.Page.getAttribute('name').setValue('test');

        expect(xrm.Page.getAttribute('name').getValue()).toEqual('test');
        expect(xrm.Page.getAttribute('name').getIsDirty()).toEqual(true);
    }

    /** Attribute onchange event */
    test_onChange() {
        //The Fake XrmPage object does not load the configured event handlers.
        var xrm = Fakes.loadXrmPageSolution('account');

        var verify = 0;

        xrm.Page.getAttribute('name').addOnChange(() => verify++);

        //Fire on change must be called to trigger the event handler
        //Note: using setValue does not trigger the event. This is the same behaviour as the CRM implementation
        xrm.Page.getAttribute('name').fireOnChange();

        expect(verify).toEqual(1);
    }

    /** Test if the data xml is generated */
    test_getDataXml() {
        //Step 1: load the Xrm page object. In this example the customizations xml is used
        var xrm = Fakes.loadXrmPageSolution('account');

        //Step 2: Perform your test
        xrm.Page.getAttribute('name').setValue('test');

        //Step 3: Verify the results
        var xml = xrm.Page.data.entity.getDataXml();

        expect(xml).toEqual('<account><name>test</name></account>');
    }

    /** Picklists are loaded from the metadata */
    test_picklistLoaded() {
        //Step 1: load the Xrm page object. In this example the customizations xml is used
        var xrm = Fakes.loadXrmPageSolution('account');

        //In the case the test is if the load is performed correctly
        var attribute = xrm.Page.getAttribute('accountcategorycode');

        expect(attribute).not.toBeNull();
        var options = attribute.getOptions();
        expect(options).not.toBeNull();
        expect(options.length).toEqual(2);
        expect(options[0].value).toEqual('1');
        expect(options[1].value).toEqual('2');

    }

}

new FakeXrmPageTest().run();