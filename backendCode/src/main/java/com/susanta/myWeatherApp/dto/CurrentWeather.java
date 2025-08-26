package com.susanta.myWeatherApp.dto;

import java.util.List;

public class CurrentWeather {

	private Coord coord;
	private List<Weather> weather;
	private Main main;
	private Wind wind;
	private String name; // City name

	public CurrentWeather() {
		super();
	}

	public CurrentWeather(Coord coord, List<Weather> weather, Main main, Wind wind, String name) {
		super();
		this.coord = coord;
		this.weather = weather;
		this.main = main;
		this.wind = wind;
		this.name = name;
	}

	// Getters and Setters
	public Coord getCoord() {
		return coord;
	}

	public void setCoord(Coord coord) {
		this.coord = coord;
	}

	public List<Weather> getWeather() {
		return weather;
	}

	public void setWeather(List<Weather> weather) {
		this.weather = weather;
	}

	public Main getMain() {
		return main;
	}

	public void setMain(Main main) {
		this.main = main;
	}

	public Wind getWind() {
		return wind;
	}

	public void setWind(Wind wind) {
		this.wind = wind;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
