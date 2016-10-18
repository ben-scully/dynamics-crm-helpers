# Welcome to the jungle

 a bundle file with:
* case
* account
* contact
* etc.

 In bundle I expect:
* (Entity) case.onload
* (Entity) case.onsave
* (Entity) account.onload
* (Entity) account.onsave
* (Entity) contact.onload
* (Entity) contact.onsave

 Entity needs:
* onload(context?)
* onsave?(context?)
* access to Helpers - possibly certain helpers
* ability to import sub-files so Entity.js files aren't as long (modular)


 Helper (Helpers[] helpers) -> returns on helpers requested in parameter
* example: var helpers = ["core", "extra", "httpRequest"]
