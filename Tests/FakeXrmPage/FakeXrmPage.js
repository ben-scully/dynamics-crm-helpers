/*
 * Project Source: https://fakexrmpage.codeplex.com
 * Authors: Patrick Verbeeten
 * Version: 1.0
 * Date: 2014-06-25
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var Fakes;
(function (Fakes) {
    //Loaded customization xml is cached
    var entityCache = {};
    var customizationCache;
    var XmlCacheRecord = (function () {
        function XmlCacheRecord() {
        }
        return XmlCacheRecord;
    }());
    /** Default handler to load the customizations.xml file using a HTTP GET request. Customizations.xml is expected in the current folder*/
    function getCustomizationFile(url) {
        var file;
        $.ajax({ url: url, dataType: 'xml', async: false })
            .done(function (data) {
            file = $(data);
        })
            .fail(function () {
            throw new Error('The customizations file "' + url + '" could not be found');
        });
        return file;
    }
    Fakes.getCustomizationFile = getCustomizationFile;
    /** reference to the method to load the customization file. This can be overriden */
    Fakes.getCustomizationFileHandler = function () { return getCustomizationFile('customizations.xml'); };
    /** Load the Xrm Page model based on a definition from xml
     */
    function loadXrmPage(form, options) {
        if (options === void 0) { options = new FormOptions(); }
        return new XrmPage.ObjectBasedFormXrm(options, form);
    }
    Fakes.loadXrmPage = loadXrmPage;
    /** Load the Xrm Page model based on the customizations.xml file from an unmanaged solution
     * @param {string} entity Logical name of the entity to load the default form for
     * @param {FormOptions} options Setup options for the form
     * @param {delegate} getCustomization handler to load the customizations
     */
    function loadXrmPageSolution(entity, options, getCustomization) {
        if (options === void 0) { options = new FormOptions(); }
        if (getCustomization === void 0) { getCustomization = Fakes.getCustomizationFileHandler; }
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
            source.entityXml = customizationCache.find('Entity').filter(function (i, v) { return $(v).children('Name').text().toLowerCase() == entity.toLowerCase(); });
            if (source.entityXml.length == 0)
                throw new Error('Entity "' + entity + '" not found');
            source.formXml = source.entityXml.find('forms[type="main"]').find('systemform');
            source.relationXml = customizationCache.find('EntityRelationships');
        }
        return new XrmPage.XmlBasedFormXrm(options, source.formXml, source.entityXml, source.relationXml);
    }
    Fakes.loadXrmPageSolution = loadXrmPageSolution;
    /** Options to customize the behaviour and state of the form */
    var FormOptions = (function () {
        function FormOptions() {
            /** Xrm Form Type {@link XrmTypes.ui#getFormType}. Default: 1 (Create) */
            this.FormType = 1;
            /** Logical name of the entity */
            this.EntityName = 'fake';
            /** Values to set when loading the Form */
            this.Values = new Dictionary();
            /** Organization Language. Default: 1033 */
            this.OrgLcid = 1033;
            /** User language. Default: 1033*/
            this.UserLcid = 1033;
            /** Organization Name. Default: Fake*/
            this.OrganizationName = 'Fake';
            /** Is this an outlook client. Default: false */
            this.isOutlookClient = false;
            /** Is this an outlook client in offline mode. Default: false */
            this.isOutlookOnline = false;
        }
        return FormOptions;
    }());
    Fakes.FormOptions = FormOptions;
    var Dictionary = (function () {
        function Dictionary() {
        }
        return Dictionary;
    }());
    //#region Form Definition
    var AttributeDefinition = (function () {
        function AttributeDefinition(name) {
            this.LogicalName = name;
        }
        return AttributeDefinition;
    }());
    Fakes.AttributeDefinition = AttributeDefinition;
    var UiElementDefinition = (function () {
        function UiElementDefinition(name) {
            this.Visible = true;
            this.Name = name;
        }
        return UiElementDefinition;
    }());
    Fakes.UiElementDefinition = UiElementDefinition;
    var TabDefinition = (function (_super) {
        __extends(TabDefinition, _super);
        function TabDefinition(name, sections) {
            _super.call(this, name);
            this.Expanded = true;
            this.Sections = [];
            if (sections)
                this.Sections = sections;
        }
        return TabDefinition;
    }(UiElementDefinition));
    Fakes.TabDefinition = TabDefinition;
    var SectionDefinition = (function (_super) {
        __extends(SectionDefinition, _super);
        function SectionDefinition(name, controls) {
            _super.call(this, name);
            this.Controls = [];
            if (controls)
                this.Controls = controls;
        }
        return SectionDefinition;
    }(UiElementDefinition));
    Fakes.SectionDefinition = SectionDefinition;
    var NavigationItemDefinition = (function (_super) {
        __extends(NavigationItemDefinition, _super);
        function NavigationItemDefinition() {
            _super.apply(this, arguments);
        }
        return NavigationItemDefinition;
    }(UiElementDefinition));
    Fakes.NavigationItemDefinition = NavigationItemDefinition;
    var ControlDefinition = (function (_super) {
        __extends(ControlDefinition, _super);
        function ControlDefinition(name) {
            _super.call(this, name);
            this.DataField = name;
        }
        return ControlDefinition;
    }(UiElementDefinition));
    Fakes.ControlDefinition = ControlDefinition;
    var FormDefinition = (function () {
        function FormDefinition() {
            this.Tabs = [];
            this.Attributes = [];
            this.Navigation = [];
        }
        return FormDefinition;
    }());
    Fakes.FormDefinition = FormDefinition;
    //#endregion
    /** Module containing the implementation of the Fake types */
    var XrmPage;
    (function (XrmPage) {
        //#region Implementation of the various elements 
        var UiElement = (function () {
            function UiElement(form) {
                this._visible = false;
                this._form = form;
            }
            UiElement.baseFromJquery = function (node, result) {
                result._name = node.attr('name');
                result._label = node.parent().find('label[languagecode="' + result._form.Options.UserLcid.toString() + '"]').attr('description');
                result._visible = node.parent().attr('visible') != 'false';
            };
            UiElement.baseFromObject = function (node, result) {
                result._name = node.Name;
                result._label = node.Label;
                result._visible = node.Visible;
            };
            UiElement.prototype.getLabel = function () { return this._label; };
            UiElement.prototype.getName = function () { return this._name; };
            UiElement.prototype.setLabel = function (value) { this._label = value; };
            UiElement.prototype.getVisible = function () { return this._visible; };
            UiElement.prototype.setVisible = function (arg) { this._visible = arg; };
            UiElement.prototype.setFocus = function () { this._form._focus = this; };
            return UiElement;
        }());
        XrmPage.UiElement = UiElement;
        var Control = (function (_super) {
            __extends(Control, _super);
            function Control(form) {
                _super.call(this, form);
            }
            Control.fromJquery = function (node, form) {
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
            };
            Control.fromObject = function (node, form) {
                var result = new Control(form);
                UiElement.baseFromObject(node, result);
                result._attribute = node.DataField;
                result._disabled = node.Disabled;
                result._section = node.Section;
                result._tab = node.Tab;
                return result;
            };
            Control.prototype.setFocus = function () {
                _super.prototype.setFocus.call(this);
                this._form._controlFocus = this;
            };
            Control.prototype.addOption = function (option, index) {
                if (index)
                    this._options.splice(index, 0, option);
                else
                    this._options.push(option);
            };
            Control.prototype.clearOptions = function () {
                this._options = [];
            };
            Control.prototype.removeOption = function (value) { };
            // #endregion
            Control.prototype.getAttribute = function () {
                if (this._attribute)
                    return this._form.Page.getAttribute(this._attribute);
                else
                    return null;
            };
            Control.prototype.addCustomView = function (viewId, entityName, viewDisplayName, fetchXml, layoutXml, isDefault) { };
            Control.prototype.getControlType = function () { throw new Error('Not implemented'); };
            Control.prototype.getData = function () { throw new Error('Not implemented'); };
            Control.prototype.getDefaultView = function () { throw new Error('Not implemented'); };
            Control.prototype.getDisabled = function () { return this._disabled; };
            Control.prototype.getParent = function () { return filterArray(this._form._sections, this._tab + '>' + this._section, function (a) { return a._tab + '>' + a.getName(); })[0]; };
            Control.prototype.getObject = function () { throw new Error('Not implemented'); };
            Control.prototype.refresh = function () { };
            Control.prototype.setData = function (value) { throw new Error('Not implemented'); };
            Control.prototype.setDefaultView = function (viewGuid) { throw new Error('Not implemented'); };
            Control.prototype.setDisabled = function (value) { this._disabled = value; };
            Control.prototype.setNotification = function (message, uniqueId) { throw new Error('Not implemented'); };
            Control.prototype.clearNotification = function (value) { throw new Error('Not implemented'); };
            Control.prototype.getSrc = function () { return this._src; };
            Control.prototype.getInitialUrl = function () { throw new Error('Not implemented'); };
            Control.prototype.setSrc = function (value) { this._src = value; };
            return Control;
        }(UiElement));
        XrmPage.Control = Control;
        var ExecutionContext = (function () {
            function ExecutionContext(context, attribute) {
                this._shared = {};
                this._context = context;
                this._attribute = attribute;
            }
            ExecutionContext.prototype.getContext = function () {
                return this._context;
            };
            ExecutionContext.prototype.getDepth = function () { return -1; };
            ExecutionContext.prototype.getEventArgs = function () {
                throw new Error('Not implemented');
            };
            ExecutionContext.prototype.getEventSource = function () {
                return this._attribute;
            };
            ExecutionContext.prototype.getSharedVariable = function (key) {
                return this._shared[key];
            };
            ExecutionContext.prototype.setSharedVariable = function (key, value) {
                this._shared[key] = value;
            };
            return ExecutionContext;
        }());
        var Attribute = (function () {
            function Attribute(form) {
                this._events = [];
                this._isDirty = false;
                this._submitMode = 'dirty';
                this._form = form;
            }
            Attribute.fromJquery = function (node, form) {
                var result = new Attribute(form);
                result._type = node.find('Type').text();
                result._name = node.find('LogicalName').text();
                result._requiredLevel = node.find('RequiredLevel').text();
                if (node.children('optionset').length == 1) {
                    var options = node.children('optionset').find('option');
                    result._options = [];
                    options.each(function (i, e) {
                        result._options.push({
                            value: parseInt($(e).attr('value')),
                            text: $(e).find('label[languagecode="' + result._form.Options.UserLcid.toString() + '"]').attr('description')
                        });
                    });
                }
                result.initalize();
                return result;
            };
            Attribute.fromObject = function (node, form) {
                var result = new Attribute(form);
                result._type = node.Type;
                result._name = node.LogicalName;
                result._requiredLevel = node.RequiredLevel;
                result.initalize();
                return result;
            };
            Attribute.prototype.initalize = function () {
                this._value = this._form.Options.Values[this._name];
            };
            Attribute.prototype.addOnChange = function (ev) {
                this._events.push(ev);
            };
            Attribute.prototype.fireOnChange = function () {
                var execution = new ExecutionContext(this._form.Page.context, this);
                for (var i in this._events) {
                    this._events[i](execution);
                }
            };
            Attribute.prototype.getAttributeType = function () { return this._type; };
            Attribute.prototype.getFormat = function () { throw new Error('Not implemented'); };
            Attribute.prototype.getInitialValue = function () { throw new Error('Not implemented'); };
            Attribute.prototype.getIsDirty = function () { return this._isDirty; };
            Attribute.prototype.getMax = function () { return this._max; };
            Attribute.prototype.getMaxLength = function () { return this._maxLength; };
            Attribute.prototype.getMin = function () { return this._min; };
            Attribute.prototype.getName = function () { return this._name; };
            Attribute.prototype.getOption = function (value) {
                if (!this._options)
                    return null;
                if (!value)
                    return null;
                for (var i = 0; this._options.length; i++) {
                    if (this._options[i].value == value.toString())
                        return this._options[i];
                }
                return null;
            };
            Attribute.prototype.getOptions = function () { return this._options; };
            Attribute.prototype.getParent = function () { return this._form.Page.data.entity; };
            Attribute.prototype.getPrecision = function () { return this._precision; };
            Attribute.prototype.getRequiredLevel = function () { throw new Error('Not implemented'); }; // { return this._requiredLevel; }
            Attribute.prototype.getSelectedOption = function () {
                return this.getOption(this._value);
            };
            Attribute.prototype.getSubmitMode = function () { throw new Error('Not implemented'); }; // { return this._submitMode; }
            Attribute.prototype.getText = function () {
                var option = this.getSelectedOption();
                if (option)
                    return option.text;
                else
                    return null;
            };
            Attribute.prototype.getUserPrivilege = function () { throw new Error('Not implemented'); };
            Attribute.prototype.getValue = function () { return this._value; };
            Attribute.prototype.removeOnChange = function (ev) { this._events = this._events.filter(function (v) { return v != ev; }); };
            Attribute.prototype.setRequiredLevel = function (value) { this._requiredLevel = value; };
            Attribute.prototype.setSubmitMode = function (value) { this._submitMode = value; };
            Attribute.prototype.setValue = function (value) {
                this._value = value;
                this._isDirty = true;
            };
            return Attribute;
        }());
        XrmPage.Attribute = Attribute;
        var XrmCollection = (function () {
            function XrmCollection(source, getName) {
                this._source = source;
                this._getName = getName;
            }
            XrmCollection.prototype.item = function (index) { throw new Error('Not Implemented'); };
            XrmCollection.prototype.forEach = function (callback) {
                for (var i = 0; i < this._source.length; i++) {
                    callback(this._source[i], i); // we changed this from for:in -> regular for loop
                }
            };
            XrmCollection.prototype.get = function (argument) {
                return find(this._source, argument, this._getName);
            };
            XrmCollection.prototype.getLength = function () {
                return this._source.length;
            };
            return XrmCollection;
        }());
        XrmPage.XrmCollection = XrmCollection;
        var Data = (function () {
            function Data(form) {
                this.entity = new Entity(form);
            }
            Data.prototype.refresh = function (save) { throw new Error('Not implemented'); };
            Data.prototype.save = function () { throw new Error('Not implemented'); };
            return Data;
        }());
        var Entity = (function () {
            function Entity(form) {
                this._events = [];
                this._form = form;
                this.attributes = new XrmCollection(form._attributes, function (a) { return a.getName(); });
            }
            Entity.prototype.addOnSave = function (ev) {
                this._events.push(ev);
            };
            Entity.prototype.getDataXml = function () {
                var root = $('<' + this._form.Options.EntityName + '/>');
                this.attributes.forEach(function (a) {
                    var node = $('<' + a.getName() + '/>');
                    var value = a.getValue();
                    if (value) {
                        if (a.getAttributeType() == 'lookup') {
                            if (value.length == 1 && value[0].id) {
                                var item = value[0];
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
            };
            Entity.prototype.getEntityName = function () { return this._form.Options.EntityName; };
            Entity.prototype.getId = function () { return this._form.Options.Id; };
            Entity.prototype.getIsDirty = function () { return this.attributes.get().some(function (a) { return a.getIsDirty(); }); };
            Entity.prototype.getPrimaryAttributeValue = function () { throw new Error('Not Implemented'); };
            Entity.prototype.removeOnSave = function (ev) { this._events = this._events.filter(function (v) { return v != ev; }); };
            Entity.prototype.save = function (param) {
                var _this = this;
                this._events.forEach(function (e) { return e(new ExecutionContext(_this._form.Page.context)); });
            };
            return Entity;
        }());
        var Section = (function (_super) {
            __extends(Section, _super);
            function Section(form) {
                _super.call(this, form);
                this.controls = new XrmCollection(filterArray(form._controls, this._tab + '>' + this._name, function (a) { return a._tab + '>' + a._section; }), function (a) { return a.getName(); });
            }
            Section.fromJquery = function (node, form) {
                var result = new Section(form);
                UiElement.baseFromJquery(node, result);
                result._tab = node.parents('tab').attr('name');
                return result;
            };
            Section.fromObject = function (node, form) {
                var result = new Section(form);
                UiElement.baseFromObject(node, result);
                result._tab = node.Tab;
                return result;
            };
            Section.prototype.getParent = function () { return filterArray(this._form._tabs, this._tab, function (a) { return a.getName(); })[0]; };
            return Section;
        }(UiElement));
        XrmPage.Section = Section;
        function filterArray(array, name, getName) {
            var result = [];
            for (var i in array) {
                if (getName(array[i]) == name)
                    result.push(array[i]);
            }
            return result;
        }
        var NavigationItem = (function (_super) {
            __extends(NavigationItem, _super);
            function NavigationItem(form) {
                _super.call(this, form);
            }
            NavigationItem.fromJquery = function (formNode, relationNode, form) {
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
            };
            NavigationItem.fromObject = function (node, form) {
                var result = new NavigationItem(form);
                UiElement.baseFromObject(node, result);
                result._id = node.Name;
                return result;
            };
            NavigationItem.prototype.getId = function () {
                return this._id;
            };
            return NavigationItem;
        }(UiElement));
        XrmPage.NavigationItem = NavigationItem;
        var Tab = (function (_super) {
            __extends(Tab, _super);
            function Tab(form) {
                _super.call(this, form);
                this.sections = new XrmCollection(filterArray(form._sections, this._name, function (a) { return a._tab; }), function (a) { return a.getName(); });
            }
            Tab.fromJquery = function (node, form) {
                var result = new Tab(form);
                UiElement.baseFromJquery(node, result);
                result._displayState = node.attr('expanded') == 'false' ? 'collapsed' : 'expanded';
                return result;
            };
            Tab.fromObject = function (node, form) {
                var result = new Tab(form);
                UiElement.baseFromObject(node, result);
                result._displayState = node.Expanded ? 'collapsed' : 'expanded';
                return result;
            };
            Tab.prototype.checkSection = function (s) {
                return s._tab == this._name;
            };
            Tab.prototype.getDisplayState = function () { return this._displayState; };
            Tab.prototype.getParent = function () { return this._form.Page.ui; };
            Tab.prototype.setDisplayState = function (value) { this._displayState = value; };
            return Tab;
        }(UiElement));
        XrmPage.Tab = Tab;
        var ui = (function () {
            function ui(form) {
                this._form = form;
                this.controls = new XrmCollection(form._controls, function (a) { return a.getName(); });
                this.tabs = new XrmCollection(form._tabs, function (a) { return a.getName(); });
                this.navigation = {
                    items: new XrmCollection(form._navigation, function (a) { return a.getId(); })
                };
            }
            ui.prototype.close = function () { throw new Error('Not Implemented'); };
            ui.prototype.clearFormNotification = function (uniqueId) { throw new Error('Not Implemented'); };
            ui.prototype.setFormNotification = function (message, level, uniqueId) { throw new Error('Not Implemented'); };
            ui.prototype.getCurrentControl = function () { return this._form._controlFocus; };
            ui.prototype.getFormType = function () { return this._form.Options.FormType; };
            ui.prototype.getViewPortHeight = function () { throw new Error('Not Implemented'); };
            ui.prototype.getViewPortWidth = function () { throw new Error('Not Implemented'); };
            ui.prototype.refreshRibbon = function () { throw new Error('Not Implemented'); };
            return ui;
        }());
        var Page = (function () {
            function Page(form) {
                this._form = form;
                this.ui = new ui(form);
                this.data = new Data(form);
                this.context = new Context(form);
            }
            Page.prototype.getAttribute = function (selector) {
                return find(this._form._attributes, selector, function (a) { return a.getName(); });
            };
            //getAttribute(argument: string): Attribute; // Returns The control where the name matches the argument
            //getAttribute(argument: number): Attribute; // Returns The control where the index matches the number
            //getAttribute(argument: AttributeFunctionCallback): Array<Attribute>; // Return Value The tab where the index matches the number
            Page.prototype.getControl = function (selector) {
                return find(this._form._controls, selector, function (a) { return a.getName(); });
            };
            return Page;
        }());
        var Context = (function () {
            function Context(form) {
                this.options = form.Options;
            }
            Context.prototype.getTimeZoneOffsetMinutes = function () { throw new Error('Not implemented'); };
            Context.prototype.getIsAutoSaveEnabled = function () { throw new Error('Not implemented'); };
            Context.prototype.getAuthenticationHeader = function () { throw new Error('Not implemented'); };
            Context.prototype.getCurrentTheme = function () { throw new Error('Not implemented'); };
            Context.prototype.getOrgLcid = function () { return this.options.OrgLcid; };
            Context.prototype.getOrgUniqueName = function () { return this.options.OrganizationName; };
            Context.prototype.getQueryStringParameters = function () { throw new Error('Not implemented'); };
            Context.prototype.getServerUrl = function () { throw new Error('Not implemented'); };
            Context.prototype.getClientUrl = function () { throw new Error('Not implemented'); };
            Context.prototype.getUserId = function () { throw new Error('Not implemented'); };
            Context.prototype.getUserName = function () { throw new Error('Not implemented'); };
            Context.prototype.getUserLcid = function () { return this.options.UserLcid; };
            Context.prototype.getUserRoles = function () { throw new Error('Not implemented'); };
            Context.prototype.isOutlookClient = function () { return this.options.isOutlookClient; };
            Context.prototype.isOutlookOnline = function () { return this.options.isOutlookOnline; };
            Context.prototype.prependOrgName = function (sPath) { throw new Error('Not implemented'); };
            return Context;
        }());
        //#endregion
        /** Base class of the Fake Xrm implementation */
        var FormXrm = (function () {
            function FormXrm(options) {
                this._controls = new Array();
                this._attributes = new Array();
                this._tabs = new Array();
                this._sections = new Array();
                this._navigation = [];
                this._tabs = [];
                this._sections = [];
                this._controls = [];
                this.Options = options;
            }
            return FormXrm;
        }());
        XrmPage.FormXrm = FormXrm;
        /** Xrm implementation based on the customizations.xml */
        var XmlBasedFormXrm = (function (_super) {
            __extends(XmlBasedFormXrm, _super);
            function XmlBasedFormXrm(options, formXml, entityXml, relationXml) {
                var _this = this;
                _super.call(this, options);
                this._attributes = this.getCollection(entityXml, 'attribute', function (n) { return Attribute.fromJquery(n, _this); }, function (i) { return i.getName(); });
                if (formXml) {
                    this._navigation = this.getNavigationCollection(formXml, relationXml, this);
                    this._controls = this.getCollection(formXml, 'control', function (n) { return Control.fromJquery(n, _this); }, function (i) { return i.getName(); });
                    this._sections = this.getCollection(formXml, 'section', function (n) { return Section.fromJquery(n, _this); }, function (i) { return i.getName(); });
                    this._tabs = this.getCollection(formXml, 'tab', function (n) { return Tab.fromJquery(n, _this); }, function (i) { return i.getName(); });
                }
                this.Page = new Page(this);
            }
            XmlBasedFormXrm.prototype.getNavigationCollection = function (formXml, relationXml, xrm) {
                var relations = relationXml.find('EntityRelationship');
                var result = [];
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
            };
            XmlBasedFormXrm.prototype.getCollection = function (root, selector, load, getName) {
                var result = new Array();
                var nodes = root.find(selector);
                nodes.each(function (index, element) {
                    var item = load($(element));
                    result[getName(item)] = item;
                });
                return result;
            };
            return XmlBasedFormXrm;
        }(FormXrm));
        XrmPage.XmlBasedFormXrm = XmlBasedFormXrm;
        /** Xrm implementation based on a definition  object */
        var ObjectBasedFormXrm = (function (_super) {
            __extends(ObjectBasedFormXrm, _super);
            function ObjectBasedFormXrm(options, formDefinition) {
                var _this = this;
                _super.call(this, options);
                this._attributes = this.getCollection(formDefinition.Attributes, function (n) { return Attribute.fromObject(n, _this); }, function (i) { return i.getName(); });
                this._navigation = this.getCollection(formDefinition.Navigation, function (n) { return NavigationItem.fromObject(n, _this); }, function (i) { return i.getId(); });
                if (formDefinition.Tabs) {
                    this._tabs = this.getCollection(formDefinition.Tabs, function (n) { return Tab.fromObject(n, _this); }, function (i) { return i.getName(); });
                    var sections = [];
                    formDefinition.Tabs.forEach(function (v) {
                        v.Sections.forEach(function (s) { return s.Tab = v.Name; });
                        sections = sections.concat(v.Sections);
                    });
                    this._sections = this.getCollection(sections, function (n) { return Section.fromObject(n, _this); }, function (i) { return i.getName(); });
                    var controls = [];
                    sections.forEach(function (v) {
                        v.Controls.forEach(function (c) {
                            c.Tab = v.Tab;
                            c.Section = v.Name;
                        });
                        controls = controls.concat(v.Controls);
                    });
                    this._controls = this.getCollection(controls, function (n) { return Control.fromObject(n, _this); }, function (i) { return i.getName(); });
                }
                this.Page = new Page(this);
            }
            ObjectBasedFormXrm.prototype.getCollection = function (source, load, getName) {
                var result = new Array();
                if (source) {
                    source.forEach(function (v) {
                        var item = load(v);
                        result[getName(item)] = item;
                    });
                }
                return result;
            };
            return ObjectBasedFormXrm;
        }(FormXrm));
        XrmPage.ObjectBasedFormXrm = ObjectBasedFormXrm;
        ;
        function find(collection, selector, getName) {
            if (!selector)
                return findAll(collection, function (a) { return true; });
            if (typeof selector == 'string')
                return findOne(collection, function (a) { return getName(a) == selector; });
            if (typeof selector == 'function')
                return findAll(collection, selector);
            throw new Error("selector not supported");
        }
        function findOne(collection, match) {
            for (var i in collection) {
                if (match(collection[i]))
                    return collection[i];
            }
            return null;
        }
        function findAll(collection, match) {
            var result = [];
            for (var i in collection) {
                if (match(collection[i]))
                    result.push(collection[i]);
            }
            return result;
        }
    })(XrmPage || (XrmPage = {}));
})(Fakes || (Fakes = {}));
module.export = Fakes;