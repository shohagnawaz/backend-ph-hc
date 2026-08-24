import { prisma } from "../../lib/prisma"
import { IUpdateDoctorPayload } from "./doctor.interface";

const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        where: {
            isDeleted: false
        },
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true
                }
            }
        }
    });
    return doctors;
};

const getDoctorById = async (id: string) => {
    const doctor = prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false
        },
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true
                }
            }
        }
    });

    if (!doctor) {
        throw new Error("Doctor not found")
    }

    return doctor;
};


const updateDoctor = async (
        id: string,
        payload: IUpdateDoctorPayload
    ) => {
    const doctorExists = await prisma.doctor.findUnique({
        where: {
            id
        }
    });

    if (!doctorExists) {
        throw new Error("Doctor not found");
    }

    const result = await prisma.$transaction(async (tx) => {

        // 1. Update doctor information
        if (payload.doctor) {
            await tx.doctor.update({
                where: {
                    id
                },
                data: {
                    ...payload.doctor
                }
            });
        }

        // 2. Update specialties
        if (payload.specialties) {

            for (const specialty of payload.specialties) {

                if (specialty.shouldDelete) {

                    // Remove specialty from doctor
                    await tx.doctorSpecialty.deleteMany({
                        where: {
                            doctorId: id,
                            specialtyId: specialty.specialtyId
                        }
                    });

                } else {

                    // Add specialty to doctor
                    await tx.doctorSpecialty.upsert({
                        where: {
                            doctorId_specialtyId: {
                                doctorId: id,
                                specialtyId: specialty.specialtyId
                            }
                        },
                        update: {},
                        create: {
                            doctorId: id,
                            specialtyId: specialty.specialtyId
                        }
                    });
                }
            }
        }

        // 3. Return updated doctor
        return tx.doctor.findUnique({
            where: {
                id
            },
            include: {
                user: true,
                specialties: {
                    include: {
                        specialty: true
                    }
                }
            }
        });
    });

    return result;
};

const deleteDoctor = async (id: string) => {
    const doctorExists = await prisma.doctor.findUnique({
        where: {
            id
        }
    });

    if (!doctorExists) {
        throw new Error("Doctor not found")
    }

    if (doctorExists.isDeleted) {
        throw new Error("Doctor is already deleted");
    }

    const result = await prisma.$transaction(async (tx) => {
        const deleteDoctor = await tx.doctor.update({
            where: {
                id
            },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        });

        await tx.user.update({
            where: {
                id: doctorExists.userId
            },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        });

        return deleteDoctor;
    });

    return result;
};

export const DoctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
};