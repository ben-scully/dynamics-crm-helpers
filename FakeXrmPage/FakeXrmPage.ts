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

/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/xrmpage/xrm.d.ts" />


module Fakes {
    //Loaded customization xml is cached
    var entityCache: { [index: string]: XmlCacheRecord } = {};
    var customizationCache: JQuery;

    class XmlCacheRecord {
        entityXml: JQuery;
        formXml: JQuery;
        relationXml: JQuery;
    }
    /** Interface to allow customization of loading the customization xml file*/
    export interface getCustomizationFileDelegate {
        (): JQuery
    }
    /** Default handler to load the customizations.xml file using a HTTP GET request. Customizations.xml is expected in the current folder*/
    export function getCustomizationFile(url: string) {
        var file: JQuery;
        $.ajax({ url: url, dataType: 'xml', async: false })
            .done(function (data) {
                file = $(data);
            })
            .fail(function () {
                throw new Error('The customizations file "' + url + '" could not be found');
            });

        return file;
    }
    /** reference to the method to load the customization file. This can be overriden */
    export var getCustomizationFileHandler = () => getCustomizationFile('customizations.xml');

    /** Load the Xrm Page model based on a definition from xml
     */
    export function loadXrmPage(form: FormDefinition, options: FormOptions = new FormOptions()): Xrm.XrmStatic {
        return new XrmPage.ObjectBasedFormXrm(options, form);
    }
    /** Load the Xrm Page model based on the customizations.xml file from an unmanaged solution
     * @param {string} entity Logical name of the entity to load the default form for
     * @param {FormOptions} options Setup options for the form
     * @param {delegate} getCustomization handler to load the customizations
     */
    export function loadXrmPageSolution(entity: string, options: FormOptions = new FormOptions(), getCustomization: getCustomizationFileDelegate = getCustomizationFileHandler): Xrm.XrmStatic {
        var source = entityCache[entity];

        options.EntityName = entity;

        if (!source) {
            source = new XmlCacheRecord();
            entityCache[entity] = source;
        }

        if (!source.entityXml) {
            if (!customizationCache) {
                customizationCache = getCustomization();
            }

            //NOTE: any cast
            //The jquery typeing file only specifies the i parameter in the delegate the v part is missing
            source.entityXml = (<any>customizationCache.find('Entity')).filter((i: Number, v: Element) => $(v).children('Name').text().toLowerCase() == entity.toLowerCase());
            if (source.entityXml.length == 0)
                throw new Error('Entity "' + entity + '" not found');

            source.formXml = source.entityXml.find('forms[type="main"]').find('systemform');
            source.relationXml = customizationCache.find('EntityRelationships');
        }

        return new XrmPage.XmlBasedFormXrm(options, source.formXml, source.entityXml, source.relationXml);
    }

    /** Options to customize the behaviour and state of the form */
    export class FormOptions {
        /** Xrm Form Type {@link XrmTypes.ui#getFormType}. Default: 1 (Create) */
        FormType: number = 1;
        /** Id of the record. */
        Id: string;
        /** Logical name of the entity */
        EntityName: string = 'fake';
        /** Values to set when loading the Form */
        Values: { [index: string]: any } = new Dictionary<any>();
        /** Organization Language. Default: 1033 */
        OrgLcid: number = 1033;
        /** User language. Default: 1033*/
        UserLcid: number = 1033;
        /** Organization Name. Default: Fake*/
        OrganizationName: string = 'Fake';
        /** Is this an outlook client. Default: false */
        isOutlookClient: boolean = false;
        /** Is this an outlook client in offline mode. Default: false */
        isOutlookOnline: boolean = false;
    }
    class Dictionary<T> { [index: string]: T }
    
    //#region Form Definition
    export class AttributeDefinition {
        constructor(name?: string) {
            this.LogicalName = name;
        }
        /** Attribute type {@link XrmTypes.Attribute#getAttributeType */
        Type: string;
        LogicalName: string;
        /** Attribute required level {@link XrmTypes.Attribute#getRequiredLevel */
        RequiredLevel: string
    }
    export class UiElementDefinition {
        constructor(name?: string) {
            this.Name = name;
        }
        Name: string;
        Label: string;
        Visible: boolean = true;
    }
    export class TabDefinition extends UiElementDefinition {
        constructor(name?: string, sections?: SectionDefinition[] ) {
            super(name);

            if (sections)
                this.Sections = sections;
        }
        Expanded: boolean = true;
        Sections: SectionDefinition[] = [];
    }
    export class SectionDefinition extends UiElementDefinition {
        constructor(name?: string, controls?: ControlDefinition[]) {
            super(name);

            if (controls)
                this.Controls = controls;
        }
       /** Internal field. Does not need to be set. */
        Tab: string;
        Controls: ControlDefinition[] = [];
    }
    export class NavigationItemDefinition extends UiElementDefinition {
    }
    export class ControlDefinition extends UiElementDefinition {
        constructor(name?: string) {
            super(name);
            this.DataField = name;
        }

        DataField: string;
        Disabled: boolean;
        /** Internal field. Does not need to be set. */
        Section: string;
        /** Internal field. Does not need to be set. */
        Tab: string;
    }
    export class FormDefinition {
        Tabs: TabDefinition[] = [];
        Attributes: AttributeDefinition[] = [];
        Navigation: NavigationItemDefinition[] = [];
    }
    //#endregion

    /** Module containing the implementation of the Fake types */
    module XrmPage {
        //#region Implementation of the various elements 
        export class UiElement {
            _name: string;
            _label: string;
            _visible: boolean = false;
            _form: FormXrm;

            static baseFromJquery<T extends UiElement>(node: JQuery, result: T) {
                result._name = node.attr('name');
                result._label = node.parent().find('label[languagecode="' + result._form.Options.UserLcid.toString() + '"]').attr('description');
                result._visible = node.parent().attr('visible') != 'false';
            }
            static baseFromObject<T extends UiElement>(node: UiElementDefinition, result: T) {
                result._name = node.Name;
                result._label = node.Label;
                result._visible = node.Visible;
            }
            constructor(form: FormXrm) {
                this._form = form;
            }

            getLabel(): string { return this._label; }
            getName(): string { return this._name; }
            setLabel(value: string) { this._label = value; }
            getVisible(): boolean { return this._visible; }
            setVisible(arg: boolean): void { this._visible = arg; }
            setFocus() { this._form._focus = this; }
        }

        export class Control extends UiElement implements Xrm.Page.Control {
            _attribute: string;
            _disabled: boolean;
            _form: FormXrm;

            _tab: string;
            _section: string;
            static fromJquery(node: JQuery, form: FormXrm): Control {
                var result = new Control(form);
                UiElement.baseFromJquery(node, result);
                result._attribute = node.attr('datafieldname');
                result._name = node.attr('id');

                result._disabled = node.attr('disabled') == 'true';
                result._section = node.parents('section').attr('name');
                result._tab = node.parents('tab').attr('name');

                var attribute = form._attributes[result._attribute];
                if (attribute)
                    result._options = attribute._options;

                return result;
            }
            static fromObject(node: ControlDefinition, form: FormXrm): Control {
                var result = new Control(form);
                UiElement.baseFromObject(node, result);
                result._attribute = node.DataField;

                result._disabled = node.Disabled;
                result._section = node.Section;
                result._tab = node.Tab;

                return result;
            }
            constructor(form: FormXrm) {
                super(form);

            }

            setFocus() {
                super.setFocus();
                this._form._controlFocus = this;
            }

            // #region "Option Set"
            _options: Xrm.Page.OptionSetValue[]

            addOption(option: Xrm.Page.OptionSetValue, index?: number): void {
                if (index)
                    this._options.splice(index, 0, option);
                else
                    this._options.push(option);
            }
            clearOptions(): void {
                this._options = [];
            }
            removeOption(value: number): void { }
            // #endregion

            getAttribute(): Xrm.Page.Attribute {
                if (this._attribute)
                    return this._form.Page.getAttribute(this._attribute);
                else
                    return null;
            }
            addCustomView(viewId: string, entityName: string, viewDisplayName: string, fetchXml: string, layoutXml: string, isDefault: boolean): void { }
            getControlType(): string { throw new Error('Not implemented'); }
            getData(): string { throw new Error('Not implemented'); }
            getDefaultView(): string { throw new Error('Not implemented'); }
            getDisabled(): boolean { return this._disabled; }
            getParent(): Section { return filterArray(this._form._sections, this._tab + '>' + this._section, (a) => a._tab + '>' + a.getName())[0]; }
            getObject(): Object { throw new Error('Not implemented'); }
            refresh(): void { }
            setData(value: string): void {throw new Error('Not implemented') }
            setDefaultView(viewGuid: string): void {throw new Error('Not implemented') }
            setDisabled(value: boolean): void { this._disabled = value; }
            setNotification(message: string, uniqueId: string): boolean {throw new Error('Not implemented') }
            clearNotification(value: string): boolean {throw new Error('Not implemented') }


            //#region Iframe
            _src: string;
            getSrc(): string { return this._src; }
            getInitialUrl(): string { throw new Error('Not implemented'); }
            setSrc(value: string): void { this._src = value; }
            //#endregion
        }
        class ExecutionContext implements Xrm.Page.EventContext {
            constructor(context: Xrm.Context, attribute?: Xrm.Page.Attribute) {
                this._context = context;
                this._attribute = attribute;
            }

            private _context: Xrm.Context;
            private _attribute: Xrm.Page.Attribute;
            private _shared: any = {};

            getContext(): Xrm.Context {
                return this._context;
            }
            getDepth(): number { return -1; }
            getEventArgs(): Xrm.Page.SaveEventArguments {
                throw new Error('Not implemented');
            }
            getEventSource(): Xrm.Page.Attribute {
                return this._attribute;
            }
            getSharedVariable(key: string): Object {
                return this._shared[key]
            }
            setSharedVariable(key: string, value: Object) {
                this._shared[key] = value;
            }
        }
        export class Attribute implements Xrm.Page.Attribute {
            _value: any;
            _events: Array<{ (source?: Xrm.Page.EventContext): void }> = [];
            _type: string;
            _name: string;
            _isDirty: boolean = false;
            _form: FormXrm;
            _requiredLevel: string;
            _options: Xrm.Page.OptionSetValue[];
            _max: number;
            _min: number;
            _maxLength: number;
            _precision: number;
            _submitMode: string = 'dirty';
            controls: Xrm.Collection.ItemCollection<Control>;

            static fromJquery(node: JQuery, form: FormXrm): Attribute {
                var result = new Attribute(form);
                result._type = node.find('Type').text();
                result._name = node.find('LogicalName').text();
                result._requiredLevel = node.find('RequiredLevel').text();

                if (node.children('optionset').length == 1) {
                    var options = node.children('optionset').find('option');
                    result._options = [];
                    options.each((i, e) => {
                        result._options.push(
                            {
                                value: parseInt($(e).attr('value')),    // this is dodgey, we added in parseInt optimistically
                                text: $(e).find('label[languagecode="' + result._form.Options.UserLcid.toString() + '"]').attr('description')
                            });
                    });
                }

                result.initalize();

                return result;
            }
            static fromObject(node: AttributeDefinition, form: FormXrm): Attribute {
                var result = new Attribute(form);
                result._type = node.Type;
                result._name = node.LogicalName;
                result._requiredLevel = node.RequiredLevel;

                result.initalize();

                return result;
            }
            private initalize() {
                this._value = this._form.Options.Values[this._name];
            }
            constructor(form: FormXrm) {
                this._form = form;
            }

            addOnChange(ev: { (source?: Xrm.Page.EventContext) }): void {
                this._events.push(ev);
            }
            fireOnChange(): void {
                var execution = new ExecutionContext(this._form.Page.context, this);

                for (var i in this._events) {
                    this._events[i](execution);
                }
            }
            getAttributeType(): string { return this._type; }
            getFormat(): string { throw new Error('Not implemented'); }
            getInitialValue(): number { throw new Error('Not implemented'); }
            getIsDirty(): boolean { return this._isDirty; }
            getMax(): number { return this._max; }
            getMaxLength(): number { return this._maxLength; }
            getMin(): number { return this._min; }
            getName(): string { return this._name; }
            getOption(value: any): Xrm.Page.OptionSetValue {
                if (!this._options)
                    return null;
                if (!value)
                    return null;

                for (var i = 0; this._options.length; i++) {

                    if (this._options[i].value == value.toString())
                        return this._options[i];
                }
                return null;
            }
            getOptions(): Xrm.Page.OptionSetValue[] { return this._options; }
            getParent(): Xrm.Page.Entity { return this._form.Page.data.entity; }
            getPrecision(): number { return this._precision; }
            getRequiredLevel(): Xrm.Page.RequirementLevel   { throw new Error('Not implemented'); } // { return this._requiredLevel; }
            getSelectedOption(): Xrm.Page.OptionSetValue {
                return this.getOption(this._value);
            }
            getSubmitMode(): Xrm.Page.SubmitMode { throw new Error('Not implemented'); } // { return this._submitMode; }
            getText(): string {
                var option = this.getSelectedOption();
                if (option)
                    return option.text;
                else
                    return null;
            }
            getUserPrivilege(): Xrm.Page.Privilege { throw new Error('Not implemented'); }
            getValue(): any { return this._value; }
            removeOnChange(ev: any): void { this._events = this._events.filter((v) => v != ev); }
            setRequiredLevel(value: string): void { this._requiredLevel = value; }
            setSubmitMode(value: string): void { this._submitMode = value; }
            setValue(value: any) {
                this._value = value;
                this._isDirty = true;
            }
        }

        export class XrmCollection<T> {
            _source: Array<T>;
            _getName: { (a: T): string };
            constructor(source: Array<T>, getName: { (a: T): string }) {
                this._source = source;
                this._getName = getName;
            }

            length: number;
            item(index: number): T { throw new Error('Not Implemented'); }
            forEach(callback: { (attribute: T, index: number) }): void {
                for (var i = 0; i < this._source.length; i++) {
                    callback(this._source[i], i);   // we changed this from for:in -> regular for loop
                }
            }
            get(argument?: any): any {
                return find(this._source, argument, this._getName);
            }
            getLength(): number {
                return this._source.length;
            }
        }
        class Data implements Xrm.Data {
            constructor(form: FormXrm) {
                this.entity = new Entity(form);
            }
            entity: Xrm.Page.Entity;
            process: Xrm.Page.data.ProcessManager;
            refresh( save: boolean ): Xrm.Async.XrmPromise { throw new Error('Not implemented'); }
            save(): Xrm.Async.XrmPromise { throw new Error('Not implemented'); }
        }
        class Entity implements Xrm.Page.Entity {
            _form: FormXrm;
            _events: Array<{ (context?: Xrm.Page.EventContext): void }> = [];

            constructor(form: FormXrm) {
                this._form = form;
                this.attributes = new XrmCollection<Attribute>(form._attributes, (a) => a.getName());
            }
            attributes: Xrm.Collection.ItemCollection<Attribute>;
            
            addOnSave(ev: any): void {
                this._events.push(ev);
            }
            getDataXml(): string {
                var root = $('<' + this._form.Options.EntityName + '/>');

                this.attributes.forEach((a) => {
                    var node = $('<' + a.getName() + '/>');
                    var value = a.getValue();
                    if (value) {
                        if (a.getAttributeType() == 'lookup') {
                            if (value.length == 1 && value[0].id) {
                                var item = <Xrm.Page.LookupValue>value[0];

                                node.attr('name', item.name);
                                node.attr('type', item.entityType);
                                node.text(item.id);
                            }
                        }
                        else {
                            node.text(value);
                        }
                    }
                    if (a.getSubmitMode() == 'always'
                        || (a.getSubmitMode() == 'dirty' && a.getIsDirty())) {
                        root.append(node);
                    }
                });

                return $('<root/>').append(root).html();
            }
            getEntityName(): string { return this._form.Options.EntityName }
            getId(): string { return this._form.Options.Id; }
            getIsDirty(): boolean { return this.attributes.get().some((a: Xrm.Page.Attribute) => a.getIsDirty()); }
            getPrimaryAttributeValue(): string { throw new Error('Not Implemented'); }
            removeOnSave(ev): void { this._events = this._events.filter((v) => v != ev); }
            save(param?: string): void {
                this._events.forEach((e) => e(new ExecutionContext(this._form.Page.context)));
            }
        }
        export class Section extends UiElement implements Xrm.Page.Section {
            
            _tab: string;
            static fromJquery(node: JQuery, form: FormXrm): Section {
                var result = new Section(form);
                UiElement.baseFromJquery(node, result);
                result._tab = node.parents('tab').attr('name');
                return result;
            }
            static fromObject(node: SectionDefinition, form: FormXrm): Section {
                var result = new Section(form);
                UiElement.baseFromObject(node, result);
                result._tab = node.Tab;

                return result;
            }

            constructor(form: FormXrm) {
                super(form);

                this.controls = new XrmCollection(filterArray(form._controls, this._tab + '>' + this._name, (a) => a._tab + '>' + a._section), (a) => a.getName());
            }

            getParent(): Tab { return filterArray(this._form._tabs, this._tab, (a) => a.getName())[0]; }
            controls: XrmCollection<Xrm.Page.Control>;
        }
        function filterArray<T>(array: T[], name: string, getName: { (a: T): string }): T[] {
            var result = [];

            for (var i in array) {
                if (getName(array[i]) == name)
                    result.push(array[i]);
            }

            return result;
        }
        export class NavigationItem extends UiElement implements Xrm.Page.NavigationItem {
            _id: string;
            static fromJquery(formNode: JQuery, relationNode: JQuery, form: FormXrm): NavigationItem {
                var result = new NavigationItem(form);
                if (formNode) {
                    UiElement.baseFromJquery(formNode, result);
                    result._id = formNode.attr('Id');
                    result._label = formNode.find('Title[LCID="' + result._form.Options.UserLcid.toString() + '"]').attr('Text');
                    result._visible = formNode.attr('show') == 'true';

                    return result;
                }
                else {
                    result._id = 'nav_' + relationNode.attr('Name');
                    result._label = 'TODO';
                    result._visible = true;

                    return result;
                }
            }
            static fromObject(node: NavigationItemDefinition, form: FormXrm): NavigationItem {
                var result = new NavigationItem(form);
                UiElement.baseFromObject(node, result);
                result._id = node.Name;

                return result;
            }
            constructor(form: FormXrm) {
                super(form);
            }
            getId(): string {
                return this._id;
            }
        }
        export class Tab extends UiElement implements Xrm.Page.Tab {
            _name: string;
            _displayState: Xrm.Page.ui.DisplayState;
            static fromJquery(node: JQuery, form: FormXrm): Tab {
                var result = new Tab(form);
                UiElement.baseFromJquery(node, result);
                result._displayState = node.attr('expanded') == 'false' ? 'collapsed' : 'expanded';
                return result;
            }
            static fromObject(node: TabDefinition, form: FormXrm): Tab {
                var result = new Tab(form);
                UiElement.baseFromObject(node, result);
                result._displayState = node.Expanded ? 'collapsed' : 'expanded';

                return result;
            }

            constructor(form: FormXrm) {
                super(form);

                this.sections = new XrmCollection(filterArray(form._sections, this._name, (a) => a._tab), (a) => a.getName());
            }
            private checkSection(s: Section): boolean {
                return s._tab == this._name;
            }
            getDisplayState():Xrm.Page.ui.DisplayState { return this._displayState; }
            getParent() { return this._form.Page.ui; }
            setDisplayState(value: Xrm.Page.ui.DisplayState) { this._displayState = value; }
            sections: Xrm.Collection.ItemCollection<Section>;
        }
        class ui implements Xrm.Ui {
            _form: FormXrm;
            process: Xrm.Page.data.ProcessManager;

            constructor(form: FormXrm) {
                this._form = form;
                this.controls = new XrmCollection<Xrm.Page.Control>(form._controls, (a) => a.getName());
                this.tabs = new XrmCollection<Xrm.Page.Tab>(form._tabs, (a) => a.getName());
                this.navigation = {
                    items: new XrmCollection<Xrm.Page.NavigationItem>(form._navigation, (a) => a.getId())
                }
            }

            close(): void { throw new Error('Not Implemented'); }
            clearFormNotification(uniqueId: string): boolean { throw new Error('Not Implemented'); }
            setFormNotification(message: string, level: string, uniqueId: string): boolean { throw new Error('Not Implemented'); }
            getCurrentControl(): Control { return this._form._controlFocus; }
            getFormType(): number { return this._form.Options.FormType; }
            getViewPortHeight(): number { throw new Error('Not Implemented'); }
            getViewPortWidth(): number { throw new Error('Not Implemented'); }
            refreshRibbon(): void { throw new Error('Not Implemented'); }
            controls: Xrm.Collection.ItemCollection<Control>;
            navigation: Xrm.Page.Navigation;
            formSelector: Xrm.Page.FormSelector;
            tabs: Xrm.Collection.ItemCollection<Tab>;

        }

        class Page implements Xrm.Page {
            context: Xrm.Context;
            data: Xrm.Data;
            ui: Xrm.Ui;

            _form: FormXrm;
            constructor(form: FormXrm) {
                this._form = form;
                this.ui = new ui(form);
                this.data = new Data(form);
                this.context = new Context(form);
                
            }

            getAttribute(selector?: any): any {
                return find(this._form._attributes, selector, (a) => a.getName());
            }
            //getAttribute(argument: string): Attribute; // Returns The control where the name matches the argument
            //getAttribute(argument: number): Attribute; // Returns The control where the index matches the number
            //getAttribute(argument: AttributeFunctionCallback): Array<Attribute>; // Return Value The tab where the index matches the number
            getControl(selector?: any): any {
                return find(this._form._controls, selector, (a) => a.getName());
            }
            //getControl(argument: string): Control; // Returns The control where the name matches the argument
            //getControl(argument: number): Control; // Returns The control where the index matches the number
            //getControl(argument: AttributeFunctionCallback): Array<Control>; // Return Value The tab where the index matches the number

        }

        class Context implements Xrm.Context {
            private form: FormXrm;
            client: Xrm.ClientContext;
            private options: FormOptions;
            constructor(form: FormXrm) {
                this.options = form.Options;
            }

            getTimeZoneOffsetMinutes(): number  { throw new Error('Not implemented'); }
            getIsAutoSaveEnabled(): boolean { throw new Error('Not implemented'); }
            getAuthenticationHeader(): string { throw new Error('Not implemented'); }
            getCurrentTheme(): Xrm.Theme { throw new Error('Not implemented'); }
            getOrgLcid(): number { return this.options.OrgLcid; }
            getOrgUniqueName(): string { return this.options.OrganizationName; }
            getQueryStringParameters(): string[] { throw new Error('Not implemented'); }
            getServerUrl(): string { throw new Error('Not implemented'); }
            getClientUrl(): string { throw new Error('Not implemented'); }
            getUserId(): string { throw new Error('Not implemented'); }
            getUserName(): string { throw new Error('Not implemented'); }
            getUserLcid(): number { return this.options.UserLcid; }
            getUserRoles(): string[] { throw new Error('Not implemented'); }
            isOutlookClient(): boolean { return this.options.isOutlookClient; }
            isOutlookOnline(): boolean { return this.options.isOutlookOnline; }
            prependOrgName(sPath: string): string { throw new Error('Not implemented'); }
        }
        //#endregion

        /** Base class of the Fake Xrm implementation */
        export class FormXrm implements Xrm.XrmStatic {
            Page: Xrm.Page;
            Utility: Xrm.Utility;

            _controls: Array<Control> = new Array<Control>();
            _attributes: Array<Attribute> = new Array<Attribute>();
            _tabs: Array<Tab> = new Array<Tab>();
            _sections: Array<Section> = new Array<Section>();
            _focus: UiElement;
            _controlFocus: Control;
            _navigation: Array<NavigationItem> = [];
            Options: FormOptions;

            constructor(options: FormOptions) {
                this._tabs = [];
                this._sections = [];
                this._controls = [];

                this.Options = options;
            }

        }

        /** Xrm implementation based on the customizations.xml */
        export class XmlBasedFormXrm extends FormXrm {
            constructor(options: FormOptions, formXml: JQuery, entityXml: JQuery, relationXml: JQuery) {
                super(options);

                this._attributes = this.getCollection<Attribute>(entityXml, 'attribute', (n) => Attribute.fromJquery(n, this), (i) => i.getName());

                if (formXml) {
                    this._navigation = this.getNavigationCollection(formXml, relationXml, this);

                    this._controls = this.getCollection<Control>(formXml, 'control', (n) => Control.fromJquery(n, this), (i) => i.getName());
                    this._sections = this.getCollection<Section>(formXml, 'section', (n) => Section.fromJquery(n, this), (i) => i.getName());
                    this._tabs = this.getCollection<Tab>(formXml, 'tab', (n) => Tab.fromJquery(n, this), (i) => i.getName());
                }

                this.Page = new Page(this);
            }
            private getNavigationCollection(formXml: JQuery, relationXml: JQuery, xrm: FormXrm): Array<NavigationItem> {
                var relations = relationXml.find('EntityRelationship');
                var result: Array<NavigationItem> = [];

                relations.each(function (index, element) {
                    var e = $(element);
                    if (e.find('EntityRelationshipRole').length == 1) {
                        var form = formXml.find('NavBarByRelationshipItem[RelationshipName="' + e.attr('Name') + '"]');
                        if (form.length == 1)
                            result.push(NavigationItem.fromJquery(form.first(), e, xrm));
                        else
                            result.push(NavigationItem.fromJquery(null, e, xrm));
                    }

                });

                return result;
            }
            private getCollection<T>(root: JQuery, selector: string, load: LoadFromXml<T>, getName: { (item: T): string }): Array<T> {
                var result: Array<T> = new Array<T>();

                var nodes = root.find(selector);

                nodes.each(function (index, element) {
                    var item: T = load($(element));

                    result[getName(item)] = item;
                });

                return result;
            }

        }
        /** Xrm implementation based on a definition  object */
        export class ObjectBasedFormXrm extends FormXrm {
            constructor(options: FormOptions, formDefinition: FormDefinition) {
                super(options);

                this._attributes = this.getCollection(formDefinition.Attributes, (n) => Attribute.fromObject(n, this), (i) => i.getName());
                this._navigation = this.getCollection(formDefinition.Navigation, (n) => NavigationItem.fromObject(n, this), (i) => i.getId());
                if (formDefinition.Tabs) {
                    this._tabs = this.getCollection(formDefinition.Tabs, (n) => Tab.fromObject(n, this), (i) => i.getName());

                    var sections: SectionDefinition[] = [];
                    formDefinition.Tabs.forEach((v) => {
                        v.Sections.forEach((s) => s.Tab = v.Name);
                        sections = sections.concat(v.Sections);
                    });
                    this._sections = this.getCollection(sections, (n) => Section.fromObject(n, this), (i) => i.getName());

                    var controls: ControlDefinition[] = [];
                    sections.forEach((v) => {
                        v.Controls.forEach((c) => {
                            c.Tab = v.Tab;
                            c.Section = v.Name
                            });
                        controls = controls.concat(v.Controls);
                    });
                    this._controls = this.getCollection(controls, (n) => Control.fromObject(n, this), (i) => i.getName());
                }

                this.Page = new Page(this);
            }
            private getCollection<T, D>(source: D[], load: { (v: D): T }, getName: { (item: T): string }): Array<T> {
                var result: Array<T> = new Array<T>();
                if (source) {
                    source.forEach((v) => {
                        var item: T = load(v);
                        result[getName(item)] = item;
                    });
                }

                return result;
            }

        }

        //#region Helper methods
        interface IsMatch<T> {
            (item: T): boolean;
        };
        function find<T>(collection: Array<T>, selector: any, getName: { (a: T): string }): any {
            if (!selector)
                return findAll(collection, (a) => true);

            if (typeof selector == 'string')
                return findOne(collection, (a: T) => getName(a) == selector);

            if (typeof selector == 'function')
                return findAll(collection, selector);

            throw new Error("selector not supported");
        }
        function findOne<T>(collection: Array<T>, match: IsMatch<T>): T {

            for (var i in collection) {
                if (match(collection[i]))
                    return collection[i];
            }

            return null;
        }
        function findAll<T>(collection: Array<T>, match: IsMatch<T>): T[] {

            var result = [];
            for (var i in collection) {
                if (match(collection[i]))
                    result.push(collection[i]);
            }

            return result;
        }
        interface LoadFromXml<T> {
            (node: JQuery): T
        }
        //#endregion
    }
}