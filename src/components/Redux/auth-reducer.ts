import { authApi, securityApi } from '../../api/api';
import {stopSubmit} from "redux-form";

const SET_USER_DATA = 'samurai-network/auth/SET_USER_DATA';
const SET_USER_PHOTOS = 'samurai-network/auth/SET_USER_PHOTOS';
const SET_LOGIN_DATA = 'samurai-network/auth/SET_LOGIN_DATA';
const GET_CAPTCHA_URL_SUCCESS = 'samurai-network/auth/GET_CAPTCHA_URL_SUCCESS';

type initialStateType2 = {
    userId: number | null
    email: string | null,
    password: string | null,
    login: string | null,
    isAuth: boolean,
    photos: null,
    captchaUrl: string | null,
};

let initState = {
    userId: null as number | null,
    email: null as string | null,
    password: null as string | null,
    login: null as string | null,
    isAuth: false,
    photos: null,
    captchaUrl: null as string | null,
};

export type initialStateType = typeof initState;

const authReducer = (state = initState, action: any): initialStateType2 => {
    switch (action.type) {
        case SET_USER_DATA:
        case GET_CAPTCHA_URL_SUCCESS:
            return {
                userId: 'sflsdjfsd',
                ...state,
                ...action.payload,
            };
            case SET_USER_PHOTOS:
                return {
                    ...state,
                    photos: action.photos,
                };
                
                case SET_LOGIN_DATA:
                    return {
                ...state,
                ...action.data,
                isAuth: true,
            };

        default:
            return state;
    }
};

type SetAuthtUserDataPayloadType = {
    email: string | null;
    login: string | null;
    userId: number | null;
    isAuth: boolean;
};

type SetAuthtUserDataType = {
    type: typeof SET_USER_DATA;
    payload: SetAuthtUserDataPayloadType;
};

export const setAuthtUserData = (
    email: string | null,
    login: string | null,
    userId: number | null,
    isAuth: boolean
): SetAuthtUserDataType => ({
    type: SET_USER_DATA,
    payload: { email, login, userId, isAuth },
});

type SetAuthtUserPhotosType = {
    type: typeof SET_USER_PHOTOS,
    photos: any,
}

export const setAuthtUserPhotos = (photos: any): SetAuthtUserPhotosType => ({
    type: SET_USER_PHOTOS,
    photos,
});

type SetLoginDataType = {
    type: typeof SET_LOGIN_DATA,
    data: { userId: number },
}

export const setLoginData = (userId: number): SetLoginDataType => ({
    type: SET_LOGIN_DATA,
    data: { userId },
});

type GetCaptchaUrlSuccessType = {
    type: typeof GET_CAPTCHA_URL_SUCCESS;
    payload: { captchaUrl: string };
};

export const getCaptchaUrlSuccess = (
    captchaUrl: string
): GetCaptchaUrlSuccessType => ({
    type: GET_CAPTCHA_URL_SUCCESS,
    payload: { captchaUrl },
});

export const getAuthUserData = () => {
    return async (dispatch: any) => {
        let response = await authApi.me();

        if (response.data.resultCode === 0) {
            let { email, login, id } = response.data.data;
            dispatch(setAuthtUserData(email, login, id, true));
        }
    };
};

export const login = (
    email: string,
    password: string,
    rememberMe: boolean,
    captcha: string
) => {
    return async (dispatch: any) => {
        let response = await authApi.login(
            email,
            password,
            rememberMe,
            captcha
        );
        if (response.data.resultCode === 0) {
            dispatch(getAuthUserData());
        } else {
            if (response.data.resultCode === 10) {
                dispatch(getCaptchaUrl());
            }
            let message =
                response.data.messages.length > 0
                    ? response.data.messages[0]
                    : 'Some error';
            dispatch(stopSubmit("login", {_error: message}));
        }
    };
};

export const getCaptchaUrl = () => {
    return async (dispatch: any) => {
        const response = await securityApi.getCaptchaUrl();
        const captchaUrl = response.data.url;
        dispatch(getCaptchaUrlSuccess(captchaUrl));
    };
};

export const logout = () => {
    return async (dispatch: any) => {
        let response = await authApi.logout();
        if (response.data.resultCode === 0) {
            dispatch(setAuthtUserData(null, null, null, false));
        }
    };
};

export default authReducer;
