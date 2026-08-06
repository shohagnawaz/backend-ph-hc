import { User, UserStatus } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface IRegisterPatientPayload {
    name: string,
    email: string,
    password: string
}

const registerPatient = async (payload : IRegisterPatientPayload) => {
    const {name, email, password} = payload;

    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            // default values
            // needsPasswordChange: false,
            // role: Role.PATIENT
        }
    }) 

    if(!data.user) {
        throw new Error("Failed to register patient")
    }

    //TODO: create patient profile in transaction after sign up of 
    try {
        const patient = await prisma.$transaction(async (tx) => {
        const patientTx = await tx.patient.create({
            data: {
                userId: data.user.id,
                name: payload.name,
                email: payload.email
            }
        })
        return patientTx;
    });

    return { ...data, patient };
    } 
    catch (error: any) {
        console.log("Transaction error: ", error); 
        await prisma.user.delete({
            where: {
                id: data.user.id
            }
        })
        throw error;
    }
}

interface ILogingUserPayload {
    email: string,
    password: string
}

const loginUser = async (payload: ILogingUserPayload) => {
    const { email, password } = payload;

    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    })

    if (data.user.status === UserStatus.BLOCKED) {
        throw new Error("User is blocked");
    }

    if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        throw new Error("User is deleted")
    }

    return data;
}

export const AuthService = {
    registerPatient,
    loginUser
};