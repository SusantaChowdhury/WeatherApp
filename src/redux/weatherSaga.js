import { call, put, takeLatest, all } from "redux-saga/effects";
import {
  fetchWeatherRequest,
  fetchWeatherSuccess,
  fetchWeatherFailure,
  fetchForecastRequest,
  fetchForecastSuccess,
  fetchForecastFailure,
} from "./weatherSlice";
import axios from "axios";

function fetchWeatherApi(city) {
  return axios.get(`http://localhost:8080/api/weather/current?city=${city}`);
}

function fetchForecastApi(city) {
  return axios.get(`http://localhost:8080/api/weather/forecast?city=${city}`);
}

function* fetchWeatherSaga(action) {
  try {
    const response = yield call(fetchWeatherApi, action.payload);
    yield put(fetchWeatherSuccess(response.data));

    // trigger forecast right after current weather succeeds
    yield put(fetchForecastRequest(action.payload));
  } catch (error) {
    yield put(fetchWeatherFailure(error.message));
  }
}

function* fetchForecastSaga(action) {
  try {
    const response = yield call(fetchForecastApi, action.payload);
    yield put(fetchForecastSuccess(response.data));
  } catch (error) {
    yield put(fetchForecastFailure(error.message));
  }
}

export default function* weatherSaga() {
  yield all([
    takeLatest(fetchWeatherRequest.type, fetchWeatherSaga),
    takeLatest(fetchForecastRequest.type, fetchForecastSaga),
  ]);
}
