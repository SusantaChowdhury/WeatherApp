package com.susanta.myWeatherApp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.susanta.myWeatherApp.dto.CurrentWeather;
import com.susanta.myWeatherApp.dto.Forecast5Day;
import com.susanta.myWeatherApp.dto.ForecastNDay;
import com.susanta.myWeatherApp.service.WeatherService;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "http://localhost:5173")
public class WeatherController {

	private final WeatherService weatherService;

	public WeatherController(WeatherService weatherService) {
		this.weatherService = weatherService;
	}

	@GetMapping("/current")
	public ResponseEntity<CurrentWeather> getCurrentWeather(@RequestParam String city) {
		CurrentWeather weather = weatherService.getWeatherByCity(city);
		return ResponseEntity.ok(weather);
	}

	@GetMapping
	public CurrentWeather getWeather(@RequestParam(required = false) String q,
			@RequestParam(required = false) Double lat, @RequestParam(required = false) Double lon) {

		if (q != null && !q.isEmpty()) {
			return weatherService.getWeatherByCity(q);
		} else if (lat != null && lon != null) {
			return weatherService.getWeatherByCoordinates(lat, lon);
		} else {
			throw new IllegalArgumentException("Either city (q) or lat/lon must be provided.");
		}
	}

	@GetMapping("/forecast")
	public Forecast5Day getForecast5Day(@RequestParam String city) {
		return weatherService.get5DayForecast(city);
	}

	// ✅ Forecast N-day
	@GetMapping("/nforecast")
	public ForecastNDay getForecast(@RequestParam String city, @RequestParam Integer cnt) {
		return weatherService.getForecastByCityAndDays(city, cnt);
	}
}
