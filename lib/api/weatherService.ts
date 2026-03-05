import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export const fetchWeatherByCity = async (city: string) => {
  if (!API_KEY) throw new Error("Missing OpenWeatherMap API key");

  const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
    },
  });

  return response.data;
};

