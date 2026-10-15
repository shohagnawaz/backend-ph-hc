import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreatePrescriptionPayload } from "./prescription.interface";
import { Role } from "../../../generated/prisma/enums";
import { generatePrescriptionPDF } from "./prescription.utils";
import { uploadFileToCloudinary } from "../../config/cloudinary.config";

const givePrescription = async (user: IRequestUser, payload: ICreatePrescriptionPayload) => {
    const doctorData = await prisma.doctor.findFirstOrThrow({
        where: {
            email: user?.email
        }
    });

    const appointmentData = await prisma.appointment.findFirstOrThrow({
        where: {
            id: payload.appointmentId
        },
        include: {
            patient: true,
            schedule: {
                include: {
                    doctorSchedules: true
                }
            }
        }
    });

    if (appointmentData.doctorId !== doctorData.id) {
        throw new AppError(status.BAD_REQUEST, "You can only give prescription for your own appointments");
    }

    const isAlreadyPrescribed = await prisma.prescription.findFirst({
        where: {
            appointmentId: payload.appointmentId
        }
    });

    if (isAlreadyPrescribed) {
        throw new AppError(status.BAD_REQUEST, "You have already given prescription for this appointment. You can update the prescription instead.");
    }

    const followUpDate = new Date(payload.followUpDate);

    const result = await prisma.$transaction(async (tx) => {
        const result = await tx.prescription.create({
            data: {
                ...payload,
                followUpDate,
                doctorId: appointmentData.doctorId,
                patientId: appointmentData.patientId
            }
        });

        const pdfBuffer = await generatePrescriptionPDF({
            doctorName: doctorData.name,
            patientName: appointmentData.patient.name,
            appointmentDate: appointmentData.schedule.startDateTime,
            instructions: payload.instructions,
            followUpDate,
            doctorEmail: doctorData.email,
            patientEmail: appointmentData.patient.email,
            prescriptionId: result.id,
            createdAt: new Date()
        });

        const fileName = `prescription-${Date.now()}.pdf`;
        const uploadedFile = await uploadFileToCloudinary(pdfBuffer, fileName);
        const pdfUrl = uploadedFile.secure_url;

        const updatedPrescription = await tx.prescription.update({
            where: {
                id: result.id
            },
            data: {
                pdfUrl
            }
        });

        return updatedPrescription;
    });
    
    return result;
};

const myPrescriptions = async (user: IRequestUser) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            email: user?.email
        }
    });

    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    if (isUserExists.role === Role.DOCTOR) {
        const prescriptions = await prisma.prescription.findMany({
            where: {
                doctor: {
                    email: user?.email
                }
            },
            include: {
                patient: true,
                doctor: true,
                appointment: true
            }
        });
        return prescriptions;
    }

    if (isUserExists.role === Role.PATIENT) {
        const prescriptions = await prisma.prescription.findMany({
            where: {
                patient: {
                    email: user?.email
                }
            },
            include: {
                patient: true,
                doctor: true,
                appointment: true
            }
        });
        return prescriptions;
    }
};

const getAllPrescriptions = async () => {
    const result = await prisma.prescription.findMany({
        include: {
            patient: true,
            doctor: true,
            appointment: true
        }
    });

    return result;
};

const updatePrescription = async () => { };

const deletePrescription = async () => { };

export const PrescriptionService = {
    givePrescription,
    myPrescriptions,
    getAllPrescriptions,
    updatePrescription,
    deletePrescription
};