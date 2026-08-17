import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import ms from "ms";
import { envVars } from "../../config/env";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),

    emailAndPassword: {
        enabled: true
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: Role.PATIENT
            },
            
            status: {
                type: "string",
                required: true,
                defaultValue: UserStatus.ACTIVE
            },

            needPasswordChange: {
                type: "boolean",
                required: true,
                defaultValue: false
            },
            
            isDeleted : {
                type: "boolean",
                required: true,
                defaultValue: false
            },

            deletedAt : {
                type: "date",
                required: false,
                defaultValue: null
            }
        }
    },

    session: {
        expiresIn: Number(ms(Number(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN))),
        updateAge: Number(ms(Number(envVars.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE))),
        cookieCache: {
            enabled: true,
            maxAge: Number(ms(Number(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN)))
        }
    },

    trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000"],

    advanced: {
        disableCSRFCheck: true
    }
});