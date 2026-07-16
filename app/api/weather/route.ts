import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  if (!location) {
    return NextResponse.json({ error: "Location is required" }, { status: 400 });
  }

  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    const { latitude, longitude } = geoData.results[0];

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`);
    const weatherData = await weatherRes.json();
    
    const tempCelsius = weatherData.current_weather.temperature;
    const windSpeed = weatherData.current_weather.windspeed;
    
    const currentHourIndex = new Date().getHours();
    const moisturePct = weatherData.hourly.relative_humidity_2m[currentHourIndex] || 50;
    const precipitation = 0; 

    return NextResponse.json({
      tempCelsius,
      windSpeed,
      moisturePct,
      precipitation,
      latitude,
      longitude
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
}
