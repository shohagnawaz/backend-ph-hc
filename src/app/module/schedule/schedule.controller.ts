import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createSchedule = catchAsync((req: Request, res: Response) => {
    const payload = req.body;
    const schedule = ScheduleService.createSchedule(payload);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: "Schedule created successfully",
        data: schedule
    });
});

export const ScheduleController = {
    createSchedule
}