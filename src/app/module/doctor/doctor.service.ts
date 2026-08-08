import { prisma } from "../../lib/prisma"

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

const updateDoctor = async () => {};

const deleteDoctor = async () => {};

export const DoctorService = {
    getAllDoctors,
    getDoctorById
};