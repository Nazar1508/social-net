import { usersApi } from '../../api/api';
import { profileApi } from '../../api/api';

const ADD_POST = 'ADD-POST';
const SET_USER_INFFO = 'SET_USER_INFFO';
const SET_STATUS = 'SET_STATUS';
const DELETE_POST = 'DELETE_POST';

let initialState = {
    posts: [
        { id: 1, message: 'Hi, how are you', like: '10' },
        { id: 2, message: "It's me first post", like: '15' },
    ],

    profile: null,
    status: '',
};

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST: {
            let newPost = {
                id: 5,
                message: action.newPostText,
                like: 0,
            };
            return {
                ...state,
                posts: [...state.posts, newPost],
            };
        }
        case SET_USER_INFFO: {
            return {
                ...state,
                profile: action.profile,
            };
        }
        case SET_STATUS: {
            return {
                ...state,
                status: action.status,
            };
        }

        case DELETE_POST: {
            return {
                ...state,
                posts: [...state.posts].filter(post => post.id != action.id)
            }
        }
        default:
            return state;
    }
};

export const addPostActionCreator = (newPostText) => ({
    type: ADD_POST,
    newPostText,
});

export const setUserInfo = (profile) => ({ type: SET_USER_INFFO, profile });
export const setStatus = (status) => ({ type: SET_STATUS, status });
export const deletePost = (id) => ({ type: DELETE_POST, id });

export const getUserProfile = (userId) => async (dispatch) => {
    const response = await usersApi.getProfile(userId);
    dispatch(setUserInfo(response.data));
};

export const getUserStatus = (userId) => async (dispatch) => {
    const response = await profileApi.getStatus(userId);
    dispatch(setStatus(response.data));
};

export const updateUserStatus = (status) => async (dispatch) => {
    const response = await profileApi.updateStatus(status);
    if (response.data.resultCode === 0) {
        dispatch(setStatus(status));
    }
};

export default profileReducer;
