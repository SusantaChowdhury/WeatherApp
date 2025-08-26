import { createSlice } from "@reduxjs/toolkit";

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    loading: false,
    data: null,
    error: null,
    forecast: null,
    forecastLoading: false,
    forecastError: null,
  },
  reducers: {
    // Current weather
    fetchWeatherRequest: (state, action) => {
      state.loading = true;
      state.error = null;
      state.data = null; // clear old data when new search happens
      state.forecast = null; // also clear old forecast until new one loads
    },
    fetchWeatherSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchWeatherFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 5-day Forecast
    fetchForecastRequest: (state, action) => {
      state.forecastLoading = true;
      state.forecastError = null;
      state.forecast = null; // clear old forecast data when new one is fetched
    },
    fetchForecastSuccess: (state, action) => {
      state.forecastLoading = false;
      state.forecast = action.payload;
      state.forecastError = null;
    },
    fetchForecastFailure: (state, action) => {
      state.forecastLoading = false;
      state.forecastError = action.payload;
    },
  },
});

export const {
  fetchWeatherRequest,
  fetchWeatherSuccess,
  fetchWeatherFailure,
  fetchForecastRequest,
  fetchForecastSuccess,
  fetchForecastFailure,
} = weatherSlice.actions;

export default weatherSlice.reducer;
