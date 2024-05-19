export const GET_STATE_LIST_PROCESS = "GET_STATE_LIST_PROCESS"
export const GET_STATE_LIST_SUCCESS = "GET_STATE_LIST_SUCCESS"
export const GET_STATE_LIST_ERROR = "GET_STATE_LIST_ERROR"

export type StateType = {
    "ID State": string;
    "State": string;
    "ID Year": number;
    "Year": string;
    "Population": number;
    "Slug State": string;
}

export type stateListResultType = {
    data: StateType[];
}

export interface getStateListAction {
    error: boolean;
    data: any;
    type: "GET_STATE_LIST_PROCESS" | "GET_STATE_LIST_SUCCESS" | "GET_STATE_LIST_ERROR"
    result?: stateListResultType
}


export const getStateListActionIds = {
    GET_STATE_LIST_PROCESS: GET_STATE_LIST_PROCESS,
    GET_STATE_LIST_SUCCESS: GET_STATE_LIST_SUCCESS,
    GET_STATE_LIST_ERROR: GET_STATE_LIST_ERROR
}