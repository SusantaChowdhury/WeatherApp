package com.susanta.myWeatherApp.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.susanta.myWeatherApp.dto.CurrentWeather;
import com.susanta.myWeatherApp.dto.DailyForecastEntry;
import com.susanta.myWeatherApp.dto.Forecast5Day;
import com.susanta.myWeatherApp.dto.ForecastNDay;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WeatherService {

	private final WebClient weatherWebClient;

	@Value("${app.weather.apiKey}")
	private String apiKey;

	@Value("${app.weather.units:metric}")
	private String units;

	public WeatherService(@Value("${app.weather.baseUrl}") String baseUrl, WebClient.Builder builder) {
		this.weatherWebClient = builder.baseUrl(baseUrl).build();
	}

	// ✅ Get current weather by city
	@Cacheable(cacheNames = "weatherCurrent", key = "#city.toLowerCase()")
	public CurrentWeather getWeatherByCity(String city) {
		return weatherWebClient.get()
				.uri(uriBuilder -> uriBuilder.path("/weather").queryParam("q", city).queryParam("appid", apiKey)
						.queryParam("units", units).build())
				.accept(MediaType.APPLICATION_JSON).retrieve().bodyToMono(CurrentWeather.class) // auto-maps JSON → DTO
				.block();
	}

	// Get current weather by coordinates
	public CurrentWeather getWeatherByCoordinates(Double lat, Double lon) {
		return weatherWebClient.get()
				.uri(uriBuilder -> uriBuilder.path("/weather").queryParam("lat", lat).queryParam("lon", lon)
						.queryParam("appid", apiKey).queryParam("units", units).build())
				.accept(MediaType.APPLICATION_JSON).retrieve().bodyToMono(CurrentWeather.class) // auto-maps JSON → DTO
				.block();
	}

	// Get 5-day forecast by city
	@Cacheable(cacheNames = "weatherForecast5Day", key = "#city.toLowerCase()")
	public Forecast5Day get5DayForecast(String city) {
		String response = weatherWebClient.get()
				.uri(uriBuilder -> uriBuilder.path("/forecast").queryParam("q", city).queryParam("appid", apiKey)
						.queryParam("units", units).build())
				.accept(MediaType.APPLICATION_JSON).retrieve().bodyToMono(String.class) // raw JSON (custom mapping
																						// required)
				.block();

		JSONObject json = new JSONObject(response);

		String cityName = json.getJSONObject("city").getString("name");
		String country = json.getJSONObject("city").getString("country");

		JSONArray list = json.getJSONArray("list");

		// Group by date (yyyy-MM-dd)
		Map<String, List<JSONObject>> grouped = new HashMap<>();
		for (int i = 0; i < list.length(); i++) {
			JSONObject obj = list.getJSONObject(i);
			String date = obj.getString("dt_txt").split(" ")[0];
			grouped.computeIfAbsent(date, k -> new ArrayList<>()).add(obj);
		}

		// Transform into DailyForecastEntry
		List<DailyForecastEntry> days = grouped.entrySet().stream().map(entry -> {
			String date = entry.getKey();
			List<JSONObject> forecasts = entry.getValue();

			double minTemp = forecasts.stream().mapToDouble(f -> f.getJSONObject("main").getDouble("temp_min")).min()
					.orElse(0);

			double maxTemp = forecasts.stream().mapToDouble(f -> f.getJSONObject("main").getDouble("temp_max")).max()
					.orElse(0);

			// pick first weather description of the day
			JSONObject firstWeather = forecasts.get(0).getJSONArray("weather").getJSONObject(0);
			String description = firstWeather.getString("description");
			String icon = firstWeather.getString("icon");

			return new DailyForecastEntry(date, minTemp, maxTemp, description, icon);
		}).sorted(Comparator.comparing(DailyForecastEntry::getDate)).limit(5) // only 5 days
				.collect(Collectors.toList());

		return new Forecast5Day(cityName, country, days);
	}

	// Forecast N-day by city
	public ForecastNDay getForecastByCityAndDays(String city, Integer days) {
		String response = weatherWebClient.get()
				.uri(uriBuilder -> uriBuilder.path("/forecast/daily").queryParam("q", city).queryParam("cnt", days)
						.queryParam("appid", apiKey).build())
				.accept(MediaType.APPLICATION_JSON).retrieve().bodyToMono(String.class).block();

		JSONObject json = new JSONObject(response);
		String cityName = json.getJSONObject("city").getString("name");
		String country = json.getJSONObject("city").getString("country");

		JSONArray list = json.getJSONArray("list");

		List<DailyForecastEntry> forecastDays = list.toList().stream().map(obj -> {
			JSONObject dayObj = new JSONObject((java.util.Map) obj);

			long dt = dayObj.getLong("dt");
			LocalDate date = Instant.ofEpochSecond(dt).atZone(ZoneId.systemDefault()).toLocalDate();

			JSONObject temp = dayObj.getJSONObject("temp");
			double minTemp = temp.getDouble("min");
			double maxTemp = temp.getDouble("max");

			JSONObject weatherObj = dayObj.getJSONArray("weather").getJSONObject(0);
			String description = weatherObj.getString("description");
			String icon = weatherObj.getString("icon");

			return new DailyForecastEntry(date.toString(), minTemp, maxTemp, description, icon);
		}).collect(Collectors.toList());

		return new ForecastNDay(cityName, country, forecastDays);
	}
}
