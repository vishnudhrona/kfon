import { createAction } from "@reduxjs/toolkit";

import { STATE_REDUCER_KEY } from "./constants";

export const ACTION_TYPES = {
    LOGOUT_USER: `${STATE_REDUCER_KEY}/logout`,
    DO_LOGOUT: `${STATE_REDUCER_KEY}/do-logout`,
    VALIDATE_TOKEN: `${STATE_REDUCER_KEY}/validate-token`
}

// logout: cleanup signal — root reducer resets all state + localStorage on this action
export const logout = createAction(ACTION_TYPES.LOGOUT_USER);
// doLogout: triggers logoutSaga (API call + then dispatches logout for cleanup)
export const doLogout = createAction(ACTION_TYPES.DO_LOGOUT);
export const validateToken = createAction(ACTION_TYPES.VALIDATE_TOKEN);
