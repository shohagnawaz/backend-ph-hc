import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVars } from "../../config/env";
import { CookieUtlis } from "./cookie";
import { Response } from "express";
import ms from "ms";

// Create access token
const getAccessToken = (payload: JwtPayload) => {
    const accessToken = jwtUtils.createToken(
        payload, 
        envVars.ACCESS_TOKEN_SECRET, 
        { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN} as SignOptions
    );

    return accessToken;
};

const getRefreshToken = (payload: JwtPayload) => {
    const refreshToken = jwtUtils.createToken(
        payload, 
        envVars.REFRESH_TOKEN_SECRET, 
        { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN } as SignOptions
    );

    return refreshToken;
};

const setAccessTokenCookie = (res: Response, token: string) => {
    const maxAge = ms(Number(envVars.ACCESS_TOKEN_EXPIRES_IN));
    CookieUtlis.setCookie(res, "accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: Number(maxAge)
    });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
    const maxAge = ms(Number(envVars.REFRESH_TOKEN_EXPIRES_IN));
    CookieUtlis.setCookie(res, "refreshToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: Number(maxAge)
    });
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
    const maxAge = ms(Number(envVars.REFRESH_TOKEN_EXPIRES_IN));
    CookieUtlis.setCookie(res, "better-auth.session_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: Number(maxAge)
    });
};

export const tokenUtlis = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthSessionCookie
};