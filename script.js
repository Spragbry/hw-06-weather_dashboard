const WEATHER_ENDPOINT = "https://api.openweathermap.org/data/2.5/forecast"
const API_KEY = "0316fa16dc8334829cbab528b156ea77"

const fetchForcast = async (city) => {
    const url = `${WEATHER_ENDPOINT}?q=${city}&appid=${API_KEY}&units=imperial`
    const response = await fetch(url, {method:"GET"})
    const json = await response.json()
    return json 
}
fetchForcast("Grand Rapids").then((data) => {
    console.log("data fetch", data)
})

$(document).ready = () => {
   //const data = await fetchForcast("Grand Rapids")
   //console.log("data fetch", data)
   console.log("document is ready")
}