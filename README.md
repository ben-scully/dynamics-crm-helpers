# Dynamics CRM Helpers
Helper functions, methods, packages to make Dynamics CRM Development faster to code, more accurate, faster to deploy.

## Current Problems
- Painful auto complete. e.g. Xrm -> XrmToolKit.. when trying to type Xrm.Page.
- Lack of 'import' 'export' for Javascript/Typescript.
- Repitition of code. e.g. Xrm.Page.......getAttribute("asdf").value with null checks etc COULD BE Helper.getValue("asdf").
- Lack of TypeScript. i.e. hard to move around code with F12 between files and F2 between files.
- Deploying / checkingin / version control. These are all seperate and easy to mess up and slow. There must be a better way.

## Wants
- Retrieve Settings, other records etc (CRM.Repository... tinyIoC)
- Don't use namespaces which clash with basic CRM Entities etc

## Gotchas
- Using JS to set EntityRegs on lookups: Triggers onChange if Guid is LowerCase or missing {} brackets. i.e. Guid needs to be in format "{cb37-....-k2mm}".
