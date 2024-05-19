import { Reducer } from 'redux';
import {
    getStateListAction,
    GET_STATE_LIST_ERROR,
    GET_STATE_LIST_PROCESS,
    GET_STATE_LIST_SUCCESS,
} from '../../types/StateTypes/actionStateTypes';
import { stateStoreType, stateResponse } from '../../types/StateTypes/storeStateTypes';

type stateListActions = getStateListAction;

const initStateList: stateStoreType = {
    loading: false,
    error: false,
    result: { data: [] },
};

export const stateListReducer: Reducer<stateStoreType, stateListActions> = (state = initStateList, action) => {
    switch (action.type) {
        case GET_STATE_LIST_PROCESS:
            return {
                ...state,
                result: { data: [] },
                loading: true,
                error: false,
            };
        case GET_STATE_LIST_SUCCESS:
            return {
                ...state,
                result: action.result || initStateList.result,
                loading: false,
                error: false,
            };
        case GET_STATE_LIST_ERROR:
            return {
                ...state,
                result: { data: [] },
                loading: false,
                error: action.error || true,
            };
        default:
            return state;
    }
};
