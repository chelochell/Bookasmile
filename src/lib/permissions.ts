import { createAccessControl } from "better-auth/plugins/access";
 
export const statement = {
    project: ["create", "share", "update", "delete"], // <-- Permissions available for created roles
} as const;
 
export const ac = createAccessControl(statement);
 
export const user = ac.newRole({ 
    project: ["create"], 
});
export const super_admin = ac.newRole({ 
    project: ["create", "update", "delete", "share"], 
});
 
export const patient = ac.newRole({ 
    project: ["create", "update", "delete"], 
});
export const dentist = ac.newRole({ 
    project: ["create", "update", "delete"], 
});
export const secretary = ac.newRole({ 
    project: ["create", "update", "delete"], 
});