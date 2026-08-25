import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma"
import { IUpdateAdminPayload } from "./admin.interface";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { UserStatus } from "../../../generated/prisma/enums";

const getAllAdmins = async () => {
    const admins = await prisma.admin.findMany({
        include: {
            user: true
        }
    });
    return admins;
}

const getAdminById = async (id: string) => {
    const admin = await prisma.admin.findUnique({
        where: {
            id
        },
        include: {
            user: true
        }
    });
    return admin;
}

const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
    //TODO: Validate who is updating the admin user. Only super admin can update admin user and only super admin can update super admin user but admin user cannot update super admin user

    const isAdminExist = await prisma.admin.findUnique({
        where: {
            id
        },

    });

    if (!isAdminExist) {
        throw new AppError(status.NOT_FOUND, "Admin or Super Admin not found")
    }

    const { admin } = payload;

    const updateAdmin = await prisma.admin.update({
        where: {
            id
        },
        data: {
            ...admin
        }
    });
    return updateAdmin;
}

//soft delete admin user by setting isDeleted to true and also delete the user session and account
const deleteAdmin = async (id: string, user: IRequestUser) => {

    //validate self deleting

    const isAdminExist = await prisma.admin.findUnique({
        where: {
            id
        }
    });

    if (!isAdminExist) {
        throw new AppError(status.NOT_FOUND, "Admin or Super Admin not found")
    }

    if (isAdminExist.id === user.userId) {
        throw new AppError(status.BAD_REQUEST, "You can not delete yourself")
    }

    const result = await prisma.$transaction(async (tx) => {
        await tx.admin.update({
            where: {id},
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            }
        });

        await tx.user.update({
            where: { id: isAdminExist.userId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: UserStatus.DELETED // Optional: You may also want to block the user
            }
        });

        await tx.session.deleteMany({
            where: { userId: isAdminExist.userId }
        });

        await tx.account.deleteMany({
            where: { userId: isAdminExist.userId }
        });

        const admin = await getAdminById(id);

        return admin;
    });

    return result;
}

export const AdminService = {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
}