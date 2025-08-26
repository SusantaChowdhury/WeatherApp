package com.susanta.myWeatherApp.dto;

import java.util.List;

public class ForecastNDay {
	private String city;
	private String country;
	private List<DailyForecastEntry> days;

	public ForecastNDay() {
	}

	public ForecastNDay(String city, String country, List<DailyForecastEntry> days) {
		this.city = city;
		this.country = country;
		this.days = days;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public List<DailyForecastEntry> getDays() {
		return days;
	}

	public void setDays(List<DailyForecastEntry> days) {
		this.days = days;
	}
}
