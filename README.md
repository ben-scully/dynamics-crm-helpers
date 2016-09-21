# dynamics-crm-helpers
Helper functions, methods, packages to make Dynamics CRM Development faster to code, more accurate, faster to deploy.

## Current Problems
- Painful auto complete. e.g. Xrm -> XrmToolKit.. when trying to type Xrm.Page.
- Lack of 'import' 'export'.
- Repitition of code. e.g. Xrm.Page.......getAttribute("asdf").value with null checks etc COULD BE Helper.getValue("asdf").
- Lack of TypeScript. i.e. hard to move around code with F12 between files and F2 between files.
- Deploying / checkingin / version control. These are all seperate and easy to mess up and slow. There must be a better way.
