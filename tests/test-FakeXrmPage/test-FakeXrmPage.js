var test = require("tape");
var Fakes = require("../../FakeXrmPage/FakeXrmPage.js");

console.log("Before test-FakeXrmPage...");


test("Basic FakeXrm Test", t => {
    console.log(Fakes);
    t.equals(Fakes, {});
    t.end();
})


console.log("After test-FakeXrmPage...");





function asdf () {
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