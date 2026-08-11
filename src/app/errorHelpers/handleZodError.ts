import status from "http-status"
import z, { success } from "zod";
import { TErrorSources } from "../interfaces/error.interfaces";

export const handleZodError = (err: z.ZodError) => {
    const statusCode = status.BAD_REQUEST;
    const message = "Zod validation error";
    const errorSources: TErrorSources[] = [];

    err.issues.forEach(issue => {
        errorSources.push({
            path: issue.path.join(" => "),
            message: issue.message
        })
    });

    return {
        success: false,
        message,
        errorSources
    }

}