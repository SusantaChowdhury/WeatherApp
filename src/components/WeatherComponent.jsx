import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchWeatherRequest } from "../redux/weatherSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  Gauge,
  Wind,
  ThermometerSun,
  MapPin,
  Moon,
  Sun,
} from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";

class WeatherComponent extends Component {
  state = {
    theme: "day",
    showSpinner: false,
  };

  componentDidMount() {
    this.props.fetchWeatherRequest("Delhi");
  }

  componentDidUpdate(prevProps) {
    const { loading } = this.props.weather;

    // Spinner logic with minimum duration (e.g., 1.5s)
    if (loading && !prevProps.weather.loading) {
      // Fetch started
      this.setState({ showSpinner: true });
      this.spinnerStartTime = Date.now();
    } else if (!loading && prevProps.weather.loading) {
      // Fetch finished
      const elapsed = Date.now() - this.spinnerStartTime;
      const minDuration = 1200; // 1.5 seconds
      const remaining = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        this.setState({ showSpinner: false });
      }, remaining);
    }
  }

  handleSearch = () => {
    const city = this.cityInput.value.trim();
    if (city) {
      this.props.fetchWeatherRequest(city);
    }
  };

  toggleTheme = () => {
    this.setState((prev) => ({
      theme: prev.theme === "day" ? "night" : "day",
    }));
  };

  render() {
    const { data, forecast, error } = this.props.weather;
    const { theme, showSpinner } = this.state;

    const bgTheme =
      theme === "day"
        ? "from-blue-400 to-purple-700"
        : "from-gray-900 via-indigo-900 to-black";

    const cardTheme =
      theme === "day"
        ? "bg-white/30 text-indigo-800"
        : "bg-gray-700/50 text-yellow-100";

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={data} // only animate on data changes
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={`min-h-screen flex items-center justify-center 
                      bg-gradient-to-tl ${bgTheme} p-6 
                      transition-colors duration-500 ease-in-out`}
        >
          <div
            className={`shadow-2xl rounded-3xl p-8 max-w-4xl w-full text-center 
                        backdrop-blur-xl ${cardTheme} 
                        transition-colors duration-500 ease-in-out`}
          >
            {/* Header + Theme Toggle */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl text-center mx-auto font-bold">
                Weather App
              </h1>
              <button
                onClick={this.toggleTheme}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition shadow-sm"
              >
                {theme === "day" ? (
                  <Moon className="w-5 h-5 text-gray-900" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-400" />
                )}
              </button>
            </div>

            {/* Search Input */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <input
                type="text"
                ref={(input) => (this.cityInput = input)}
                placeholder="Enter city"
                className="px-4 py-2 rounded-xl bg-white/30 text-white placeholder-gray-200 outline-none 
                           focus:ring-2 focus:ring-yellow-400 transition w-2/3 shadow-inner"
              />
              <button
                onClick={this.handleSearch}
                className="px-5 py-2 rounded-xl bg-yellow-400 text-gray-900 font-semibold 
                           hover:bg-yellow-500 transition shadow-md hover:shadow-lg active:scale-95"
              >
                Search
              </button>
            </div>

            {/* Loader & Error */}
            {showSpinner && (
              <div className="flex items-center justify-center w-full h-40">
                <ClipLoader
                  color={theme === "day" ? "#3b82f6" : "#facc15"} // auto theme color
                  loading={showSpinner}
                  size={50}
                  speedMultiplier={1.2}
                  cssOverride={{
                    borderWidth: "6px", // default is 2px, try 4–8px for thicker look
                  }}
                />
              </div>
            )}
            {error && (
              <p className="text-red-500 font-medium mb-4 animate-bounce">
                {error}
              </p>
            )}

            {/* Weather & Forecast */}
            {!showSpinner && data && forecast && forecast.days?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Current Weather Card */}
                {/* Current Weather Card */}
                {data && (
                  <motion.div
                    className={`rounded-2xl p-6 shadow-lg ${cardTheme} hover:shadow-2xl 
                                               transition-colors duration-500 ease-in-out`}
                    key={data.dt} // motion runs only when API data changes
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <h2 className="text-2xl font-semibold mb-4">
                      {forecast.city},{" "}
                      {new Intl.DisplayNames(["en"], { type: "region" }).of(
                        forecast.country
                      )}
                    </h2>

                    <p className="text-5xl font-extrabold mb-1">
                      {data.main.temp}°C
                    </p>
                    <p className="capitalize text-lg opacity-90 mb-4">
                      {data.weather[0].description}
                    </p>
                    <img
                      src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                      alt={data.weather[0].description}
                      className="mx-auto mb-4 animate-pulse"
                    />

                    {/* Animated Weather Info Grid */}
                    <motion.div
                      className="grid grid-cols-2 gap-4 text-sm mt-4"
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: { staggerChildren: 0.2 },
                        },
                      }}
                    >
                      {/* Feels Like */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: -100 },
                          show: {
                            opacity: 1,
                            x: 0,
                            transition: { type: "spring", stiffness: 50 },
                          },
                        }}
                      >
                        <WeatherInfo
                          icon={
                            <ThermometerSun className="w-5 h-5 text-amber-600" />
                          }
                          label="Feels Like"
                          value={`${Math.round(data.main.feels_like)}°C`}
                        />
                      </motion.div>

                      {/* Humidity */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: -100 },
                          show: {
                            opacity: 1,
                            x: 0,
                            transition: { type: "spring", stiffness: 50 },
                          },
                        }}
                      >
                        <WeatherInfo
                          icon={<Droplets className="w-5 h-5 text-blue-500" />}
                          label="Humidity"
                          value={`${data.main.humidity}%`}
                        />
                      </motion.div>

                      {/* Pressure */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: -100 },
                          show: {
                            opacity: 1,
                            x: 0,
                            transition: { type: "spring", stiffness: 50 },
                          },
                        }}
                      >
                        <WeatherInfo
                          icon={<Gauge className="w-5 h-5 text-purple-500" />}
                          label="Pressure"
                          value={`${data.main.pressure} hPa`}
                        />
                      </motion.div>

                      {/* Wind Speed */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: -100 },
                          show: {
                            opacity: 1,
                            x: 0,
                            transition: { type: "spring", stiffness: 50 },
                          },
                        }}
                      >
                        <WeatherInfo
                          icon={<Wind className="w-5 h-5 text-cyan-600" />}
                          label="Wind Speed"
                          value={`${data.wind.speed} m/s`}
                        />
                      </motion.div>
                    </motion.div>

                    {/* Location Info */}
                    <motion.div
                      className="mt-6 p-3 flex items-center justify-center gap-2 
                                                 rounded-lg bg-white/20 text-sm"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.8,
                        ease: "easeInOut",
                      }}
                    >
                      <MapPin className="w-5 h-5 text-red-400" />
                      <p>
                        Lat: {data.coord.lat.toFixed(2)}, Lon:{" "}
                        {data.coord.lon.toFixed(2)}
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                {/* Forecast Card */}
                {forecast && forecast.days?.length > 0 && (
                  <motion.div
                    className={`rounded-2xl p-6 shadow-lg ${cardTheme} hover:shadow-2xl 
                                               transition-colors duration-500 ease-in-out`}
                    key={forecast.days?.length} // animate only on new forecast
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  >
                    <h3 className="text-xl font-semibold mb-4">
                      {forecast.days.length}-Day Forecast
                    </h3>

                    <motion.div
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: { staggerChildren: 0.2 },
                        },
                      }}
                      className="flex flex-col gap-4"
                    >
                      {forecast.days.map((day, index) => {
                        const dateObj = new Date(day.date);
                        const dayName = dateObj.toLocaleDateString("en-US", {
                          weekday: "short",
                        });
                        const dayDate = dateObj.toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                        });
                        const avgTemp = (
                          (day.minTemp + day.maxTemp) /
                          2
                        ).toFixed(1);

                        return (
                          <motion.div
                            key={index}
                            variants={{
                              hidden: { opacity: 0, x: 100 },
                              show: {
                                opacity: 1,
                                x: 0,
                                transition: { type: "spring", stiffness: 50 },
                              },
                            }}
                            className="flex items-center justify-between bg-white/20 
                                                       rounded-xl p-3 hover:bg-white/10 transition-all"
                          >
                            <div className="flex-1 text-md">
                              <p className="font-semibold">{`${dayName}, ${dayDate}`}</p>
                            </div>

                            <div className="flex-1 flex justify-center">
                              <img
                                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                                alt={day.description}
                                className="w-12 h-12 animate-pulse"
                              />
                            </div>

                            <div className="flex-1 text-center font-semibold text-sm">
                              <p className="capitalize">{day.description}</p>
                            </div>

                            <div className="flex-1 text-center text-sm">
                              <p>Min: {Math.round(day.minTemp)}°C</p>
                              <p>Max: {Math.round(day.maxTemp)}°C</p>
                            </div>

                            <div className="flex-1 text-center text-sm">
                              <p>Avg: {avgTemp}°C</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
}

// Small reusable component for weather details
const WeatherInfo = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/20">
    {icon}
    <div>
      <p className="font-semibold">{label}</p>
      <p>{value}</p>
    </div>
  </div>
);

const mapStateToProps = (state) => ({
  weather: state.weather,
});

const mapDispatchToProps = {
  fetchWeatherRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(WeatherComponent);
