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
- JSON Schema of CRM Solution Entities
- More information back grom image.GetAttributes<OptionSet>("field") i.e. throw errors if OptionSet vs "field" is the wrong type.

## Gotchas
- Using JS to set EntityRefs on lookups: Triggers onChange if Guid is LowerCase or missing {} brackets. This is bad because you'll unexpectedly trigger on-change once Record is saved because sever will change it to uppercase (post save). i.e. Guid needs to be in format "{CB37-........-........-......-F2EE}". - found by Ben Hormann
