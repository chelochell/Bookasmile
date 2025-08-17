import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, secretary, dentist, patient, user, super_admin } from "./permissions";

export const authClient = createAuthClient({
    plugins: [
        adminClient({
            ac,
            roles: {
                user: user,
                patient: patient,
                dentist: dentist,
                secretary: secretary,
                super_admin: super_admin,
            }
        })
    ]
});