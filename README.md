# Dynamics CRM Helpers
Helper functions, methods, packages to make Dynamics CRM Development faster to code, more accurate, faster to deploy.

## Current Problems
- Painful auto complete. e.g. Xrm -> XrmToolKit.. when trying to type Xrm.Page.
- Lack of 'import' 'export' for Javascript/Typescript.
- Repitition of code. e.g. Xrm.Page.......getAttribute("asdf").value with null checks etc COULD BE Helper.getValue("asdf").
- Lack of TypeScript. i.e. hard to move around code with F12 between files and F2 between files.
- Deploying / checkingin / version control. These are all seperate and easy to mess up and slow. There must be a better way.

## Dev Rules
- Thou shal not write global variables in Javascript/Typescript.

## Wants
- Retrieve Settings, other records etc (CRM.Repository... tinyIoC)
- Don't use namespaces which clash with basic CRM Entities etc
- JSON Schema of CRM Solution Entities
- More information back grom image.GetAttributes<OptionSet>("field") i.e. throw errors if OptionSet vs "field" is the wrong type.
- Update hidden fields (aka not on the form) via JS [or not JS if there is a better way]

## Gotchas
- Using JS to set EntityRefs on lookups: Triggers onChange if Guid is LowerCase or missing {} brackets. This is bad because you'll unexpectedly trigger on-change once Record is saved because sever will change it to uppercase (post save). i.e. Guid needs to be in format "{CB37-........-........-......-F2EE}". - found by Ben Hormann


## Resources (to reference or download)
- NPM xrm-webapi https://www.npmjs.com/package/xrm-webapi
- XrmDefinitelyTyped 
..- https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/xrm
..- https://www.nuget.org/packages/xrm.TypeScript.DefinitelyTyped/
..- https://www.npmjs.com/package/@types/xrm 
- Using jQuery: Loading jQuery as a form library conflicts with Activity Feeds. Details and a solution here [jQuery and jQuery UI with Dynamics CRM 2011 & 2013](https://community.dynamics.com/crm/b/develop1/archive/2013/08/08/jquery-and-jquery-ui-with-dynamics-crm-2011-amp-2013)


## Early Bound
1. Download CrmToolBox
CrmToolBox version: v1.2016.10.2 (working) 
https://github.com/MscrmTools/XrmToolBox/releases/download/v.1.2016.10.2/XrmToolBox.zip

2. Create Project (c# library) in existing Solution

3. Save extracted XrmToolBox in to a new folder in the Project

4. Run the XrmToolBox.exe

5. Use url [example format: ]


## Access CRM in SSIS Script
var connMgr = Connections.Connection;
var connectionString = (string)connMgr.AcquireConnection(null);
var conn = new CrmConnection(connectionString);
var orgService = (IOrganizationService)conn.GetCrmService();

connMgr.ReleaseConnection(conn);

KingswaySoft.DynamicsCrmServices
KingswaySoft.IntergrationToolkit.DynamicsCrm
System.Runtime.Serialization
