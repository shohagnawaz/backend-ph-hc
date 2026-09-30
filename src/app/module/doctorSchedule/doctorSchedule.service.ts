import { DoctorSchedules, Prisma } from "../../../generated/prisma/client";
import { IQueryParams } from "../../interfaces/query.interface";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { ICreateDoctorSchedulePayload, IUpdateDoctorSchedulePayload } from "./doctor.Schedule.interface";
import { doctorScheduleFilterableFields, doctorScheduleIncludeConfig, doctorScheduleSearchableFields } from "./doctorSchedule.constant";

const createMyDoctorSchedule = async (user : IRequestUser, payload : ICreateDoctorSchedulePayload) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
        doctorId : doctorData.id
    }));

    const result = await prisma.doctorSchedules.createMany({
        data : doctorScheduleData
    });

    return result;
};

const getMyDoctorSchedules = async (user : IRequestUser, query : IQueryParams) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    const queryBuilder = new QueryBuilder<DoctorSchedules, Prisma.DoctorScheduleWhereInput, Prisma.DoctorScheduleInclude>(prisma.doctorSchedules,
        {
            doctorId: doctorData.id,
            ...query
        },
        {
            filterableFields: doctorScheduleFilterableFields,
            searchableFields: doctorScheduleSearchableFields
        }
    )
    const doctorSchedules = await queryBuilder
    .search()
    .filter()
    .paginate()
    .include({
        schedule: true,
        doctor: {
            include: {
                user: true
            }
        }
    })
    .sort()
    .fields()
    .dynamicInclude(doctorScheduleIncludeConfig)
    .execute();
    return doctorSchedules;

};

const getAllDoctorSchedules = async (req: Request, res: Response) => {

};

const getDoctorScheduleById = async (req: Request, res: Response) => {

};

const updateMyDoctorSchedule = async (user : IRequestUser, payload: IUpdateDoctorSchedulePayload) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const deleteIds = payload.scheduleIds.filter(schedule => schedule.shouldDelete).map(schedule => schedule.id);

    const createIds = payload.scheduleIds.filter(schedule => !schedule.shouldDelete).map(schedule => !schedule.id);

    const result = await prisma.$transaction(async (tx) => {

        await tx.doctorSchedules.deleteMany({
            where: {
                doctorId: doctorData.id,
                scheduleId: {
                    in : deleteIds
                }
            }
        });

        const doctorScheduleData = createIds.map((scheduleId) => ({
            doctorId : doctorData.id,
        }) )

        const result = await tx.doctorSchedules.createMany({
            data : doctorScheduleData
        });
        return result;
    });
    return result;
};

const deleteMyDoctorSchedule = async () => {

};

export const DoctorScheduleService = {
    createMyDoctorSchedule,
    getMyDoctorSchedules,
    getAllDoctorSchedules,
    getDoctorScheduleById,
    updateMyDoctorSchedule,
    deleteMyDoctorSchedule
}