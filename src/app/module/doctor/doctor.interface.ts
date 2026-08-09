export interface IUpdateDoctorPayload {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    experience?: number
}


// // Below code suggest claude AI
// //import { Gender } from "../../../generated/prisma/enums";

// //export interface IUpdateDoctorPayload {
//     name?: string;
//     profilePhoto?: string;
//     contactNumber?: string;
//     address?: string;
//     experience?: number;
//     gender?: Gender;
//     appointmentFee?: number;
//     qualification?: string;
//     currentWorkingPlace?: string;
//     designation?: string;
// }