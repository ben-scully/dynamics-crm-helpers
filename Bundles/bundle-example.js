// These are examples of what is required per entity script.

var Account = (function () {
    function makeFieldMandatory(fieldName) {
        Help.setRequired(fieldName);
    }

    function hideStuff() {
        Help.hideField(Help.Account.name);
    }

    Account.onload = function (context) {
        console.log("Account onload");
        makeFieldMandatory(Help.Account.name);
    };
    Account.onsave = function (context) {
        console.log("Account onsave");
        hideStuff();
    };
    return Account;
}());

var Contact = (function () {
    function makeFieldMandatory(fieldName) {
        Help.setRequired(fieldName);
    }

    function hideStuff() {
        Help.hideField(Help.Contact.email);
    }

    Contact.onload = function (context) {
        console.log("Contact onload");
        makeFieldMandatory(Help.Contact.telephone);
    };
    Contact.onsave = function (context) {
        console.log("Contact onsave");
        hideStuff();
    };
    return Contact;
}());

var Case = (function () {
    function doStuff(){

    }

  Case.onload = function (context) {
        console.log("Case onload");
        doStuff();
    };
  Case.onsave = function (context) {
        console.log("Case onsave");
    };
    return Case;
}());