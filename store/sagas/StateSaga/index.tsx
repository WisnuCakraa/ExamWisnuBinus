import { AxiosError, AxiosResponse } from 'axios';
import { call, put, StrictEffect, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
    GET_STATE_LIST_ERROR,
    GET_STATE_LIST_PROCESS,
    GET_STATE_LIST_SUCCESS,
} from '../../types/StateTypes/actionStateTypes';

function* getStateListWorker() {
    yield put({ type: GET_STATE_LIST_PROCESS });
    try {
        const response: AxiosResponse = yield call(
            axios.get, 'https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest'
        );
        if (response.status !== 200) {
            yield put({
                type: GET_STATE_LIST_ERROR,
                error: 'Failed to fetch state list: ' + response.statusText
            });
        } else {
            yield put({
                type: GET_STATE_LIST_SUCCESS,
                result: { data: response.data }
            });
        }
    } catch (err: AxiosError | any) {
        yield put({
            type: GET_STATE_LIST_ERROR,
            error: 'Error fetching state list: ' + err.message
        });
    }
}

export function* watchStateSaga(): Generator<StrictEffect> {
    yield takeLatest(GET_STATE_LIST_PROCESS, getStateListWorker);
}
