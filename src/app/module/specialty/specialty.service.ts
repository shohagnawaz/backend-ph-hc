import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpecialty = async (payload: Specialty) : Promise<Specialty> => {
    const specialty = await prisma.specialty.create({
        data: payload
    });

    return specialty;
};

const getAllSpecialties = async (): Promise<Specialty[]> => {
    const specialties = await prisma.specialty.findMany();
    return specialties;
};

const deleteSpecialty = async (id: string): Promise<Specialty> => {
    const specialty = await prisma.specialty.delete({
        where: {id}
    });
};

const patchSpecialty = async (id: string, payload: Partial<{title: string}>) => {
    const result = await prisma.specialty.update({
        where: { id },
        data: payload
    });

    return result
}

export const SpecialtyService = {
    createSpecialty,
    getAllSpecialties,
    deleteSpecialty,
    patchSpecialty
}