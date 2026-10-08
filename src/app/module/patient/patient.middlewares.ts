import { NextFunction, Request, Response } from "express";
import { IUpdatePatientInfoPayload, IUpdatePatientProfilePayload } from "./patient.interface";

export const updateMyPatientProfileMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data)
    }

    const payload: IUpdatePatientProfilePayload = req.body;
    const files = req.files as { [fieldName: string]: Express.Multer.File[] | undefined };

    const profilePhoto = files?.profilePhoto?.[0];
    if (profilePhoto) {
        if (!payload.patientInfo) {
            payload.patientInfo = {} as IUpdatePatientInfoPayload;
        }
        payload.patientInfo.profilePhoto = profilePhoto.path;
    }

    const medicalReportFiles = files?.medicalReports; // multer ফিল্ডের নামের সাথে মিলতে হবে
    if (medicalReportFiles && medicalReportFiles.length > 0) {
        const newReports = medicalReportFiles.map(file => ({
            reportName: file.originalname || `Medical Report - ${Date.now()}`,
            reportLink: file.path
        }));

        payload.medicalReports = Array.isArray(payload.medicalReports)
            ? [...payload.medicalReports, ...newReports]
            : newReports;
    }

    req.body = payload;
    next();
};