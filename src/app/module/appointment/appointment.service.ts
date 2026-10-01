// import { uuidv7 } from "zod/mini";
import { v7 as uuidv7 } from "uuid";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IBookAppointmentPayload } from "./appointment.interface";
import { envVars } from "../../config/env";
import { AppointmentStatus, Role } from "../../../generated/prisma/enums";
import status from "http-status";
import AppError from "../../errorHelpers/AppError";

const bookAppointment = async (payload : IBookAppointmentPayload, user : IRequestUser) => {
    const patientData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const doctorData = await prisma.doctor.findFirstOrThrow({
        where: {
            id : payload.doctorId,
            isDeleted: false,
        }
    });

    const scheduleData = await prisma.schedule.findFirstOrThrow({
        where: {
            id : payload.scheduleId
        }
    });

    const doctorSchedule = await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: scheduleData.id
            }
        }
    });

    const videoCallingId = String(uuidv7());

    const result = await prisma.$transaction( async (tx) => {
        const appointmentData = await tx.appointment.create({
            data: {
                doctorId: payload.doctorId,
                patientId: patientData.id,
                scheduleId: doctorSchedule.scheduleId,
                videoCallingId
            }
        });

        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: payload.doctorId,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true
            }
        });

        //TODO: Payment Integration will be here
        const transactionId = String(uuidv7());
        const paymentData = await tx.payment.create({
            data: {
                appointmentId : appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        });

        const session = await stripe.checkOut.session.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items : [
                {
                    price_data: {
                        currency: "bdt",
                        product_Data: {
                            name : `Appointment with Dr. ${doctorData.name}`,
                        },
                        unit_amount : doctorData.appointmentFee * 100,
                    },
                    quantity : 1
                }
            ],

            metaData: {
                appointmentId : appointmentData.id,
                paymentId : paymentData.id
            },

            success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success`,

            //cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,

            cancel_url: `${envVars.FRONTEND_URL}/dashboard/appointments`,
        });

        return {
            appointmentData,
            paymentData,
            paymentUrl : session.url
        }
    });

    return {
        appointment : result.appointmentData,
        payment : result.paymentData,
        paymentUrl: result.paymentUrl 
    }
};

const getMyAppointments = async (user: IRequestUser) => {
    // user can be patient or doctor, so we need to check both
    const patientData = await prisma.patient.findUnique({
        where: {
            email: user?.email
        }
    });

    const doctorData = await prisma.doctor.findUnique({
        where: {
            email: user?.email
        }
    });

    let appointments = [];

    if (patientData) {
        appointments = await prisma.appointment.findMany({
            where: {
                patientId: patientData.id
            },
            include: {
                doctor: true,
                schedule: true,
            }
        });
    }
    else if (doctorData) {
        appointments = await prisma.appointment.findMany({
            where: {
                doctorId: doctorData.id
            },
            include: {
                patient: true,
                schedule: true
            }
        });
    }
    else {
        throw new Error("User not found")
    }

    return appointments;
};

// 1. Completed Or Cancelled Appointments should not be allowed to update status
// 2. Doctors can only update Appointment status from schedule to inprogress or inprogress to completed or schedule to cancelled.
// 3. Patients can only cancel the scheduled appointment if it scheduled not completed or cancelled or inprogress. 
// 4. Admin and Super admin can update to any status.

const changeAppointmentStatus = async (appointmentId: string, appointmentStatus: AppointmentStatus, user: IRequestUser) => {
    const appointmentData = await prisma.appointment.findFirstOrThrow({
        where: {
            id: appointmentId,
            // status: AppointmentStatus.SCHEDULE
        },
        include: {
            doctor: true,
        }
    });

    // if (!appointmentData) {
    //     throw new AppError(status.NOT_FOUND, "Appointment not found or already completed/cancelled");
    // }

    if (user?.role === Role.DOCTOR) {
        if (!(user?.email === appointmentData.doctor.email)) {
            throw new AppError(status.BAD_REQUEST, "This is not your appointment")
        }
    }

    return await prisma.appointment.update({
        where: {
            id: appointmentId
        },
        data: {
            status: appointmentStatus
        }
    })
};