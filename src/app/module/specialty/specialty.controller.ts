import { Request, Response } from "express";
import { SpecialtyService } from "./specialty.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createSpecialty = catchAsync(
    async (req: Request, res: Response) => {
        console.log(req.body);
        console.log(req.file);
        const payload = req.body;
        const result = await SpecialtyService.createSpecialty(payload);
        sendResponse(res, {
            httpStatusCode: 201,
            success: true,
            message: "Specialty created successfully",
            data: result
        });
    }
);

const getAllSpecialties = catchAsync(
    async (req: Request, res: Response) => {
        const result = await SpecialtyService.getAllSpecialties();
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: "Specialty fetched successfully",
            data: result
        });
    }
);

const deleteSpecialty = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await SpecialtyService.deleteSpecialty(id as string);
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: "Specialty delete successfully",
            data: result
        });
    } 
);

const patchSpecialty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;

        const result = await SpecialtyService.patchSpecialty(id as string, payload);

        res.status(200).json({
            success: true,
            message: "Specialty update successfully",
            data: result
        });

    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update specialty",
            error: error.message
        });
    }
}

export const SpecialtyController = {
    createSpecialty,
    getAllSpecialties,
    deleteSpecialty,
    patchSpecialty
}