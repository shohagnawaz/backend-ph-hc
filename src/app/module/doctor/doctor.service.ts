import { prisma } from "../../lib/prisma"
import { IUpdateDoctorPayload } from "./doctor.interface";

const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
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

    if (!doctor) {
        throw new Error("Doctor not found")
    }

    return doctor;
};

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
    const doctorExists = await prisma.doctor.findUnique({
        where: {
            id
        }
    });

    if (!doctorExists) {
        thow new Error("Doctor not found");
    }

    const updateDoctor = await prisma.doctor.update({
        where: {
            id
        },
        data: payload,
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true
                }
            }
        }
    });

    return updateDoctor
};

const deleteDoctor = async () => {};

export const DoctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctor
};