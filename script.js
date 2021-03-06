const FIVEDAY_WEATHER_ENDPOINT = "https://api.openweathermap.org/data/2.5/forecast"
const TODAYS_WEATHER_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather"
const UVI_ENDPOINT = "http://api.openweathermap.org/data/2.5/uvi"
const ICON_URL = "http://openweathermap.org/img/wn/"
const API_KEY = "0316fa16dc8334829cbab528b156ea77"
let query = ""

const fetchIconUrl = (icon) => {
    return `${ICON_URL}${icon}@2x.png`
}

const fetchUVIndex = async(lat, lon) => {
    const url = `${UVI_ENDPOINT}?lat=${lat}&appid=${API_KEY}&units=imperial&lon=${lon}`
    const response = await fetch(url, {method:"GET"})
    const json = await response.json()
    return json 
}

const fetchFiveDayForcast = async (city) => {
    const url = `${FIVEDAY_WEATHER_ENDPOINT}?q=${city}&appid=${API_KEY}&units=imperial`
    const response = await fetch(url, {method:"GET"})
    const json = await response.json()
    console.log("FetchFiveDayForcast", json)
    let result = {
        five_day_forcast:[],
        city_name: json.city.name
    }
    let items = json.list
    let offset = 1
    let forcasts = []
    let hour = 12
    let today = moment()
    items.forEach((item, index) => {
        const dateStr = item.dt_txt
        const date = moment(dateStr)
        if (today.clone().add(offset, "days").dayOfYear() == date.dayOfYear()){
            if (date.hour() == hour){
                let weather = item.main
                weather.icon = fetchIconUrl(item.weather[0].icon)
                weather.windSpeed = item.wind.speed
                const result = {
                    date,
                    weather 
                }
                forcasts.push(result)
                offset += 1 
            }
        }
    });
    result.five_day_forcast = forcasts
    return result 
}


const fetchTodaysForcast = async (city) => {
    const url = `${TODAYS_WEATHER_ENDPOINT}?q=${city}&appid=${API_KEY}&units=imperial`
    const response = await fetch(url, {method:"GET"})
    const json = await response.json()
    console.log("today json", json)
    const lat = json.coord.lat
    const lon = json.coord.lon
    const uvIndex = await fetchUVIndex(lat, lon)
    console.log("UV Index", uvIndex)
    let result = {
        date: moment(),
        weather: json.main,
        city: json.name
    }
    result.weather.windSpeed = json.wind.speed
    result.weather.UV = uvIndex.value
    return result 
}

const setTodaysUI = (data) => {
    const weather = data.weather
    const dateStr = `Date: ${data.date.format("M-D-YYYY")}`
    const temp = `Temperature: ${weather.temp}`
    const name = `Name: ${data.city}`
    const windSpeed = `Wind Speed: ${weather.windSpeed}`
    const UV = `UV Index: ${weather.UV}`
    const uvClasses = ["favorable","moderate","severe"]
    $("#ci-name").html(name)
    $("#ci-date").html(dateStr)
    $("#ci-temp").html(temp)
    $("#ci-windSpeed").html(windSpeed)
    const rawUV = weather.UV
    let uvClass = null
    if (rawUV <= 2){
        uvClass = uvClasses[0]
    } else if (rawUV <= 5){
        uvClass = uvClasses[1]
    } else {
        uvClass = uvClasses[2]
    }
    $("#ci-uvi").html(`<div class=${uvClass}><p id="uv-index">UV Index: ${rawUV}</p></div>`)
}

const setFiveDayUI = (data) => {
    console.log("five day container", $("#fiveDay"))
    console.log("five day data", data)
    $("#five-day").empty()
    data.five_day_forcast.forEach((day) => {
        const dateStr = day.date.format("M-D-YYYY")
        const temp = day.weather.temp
        const humidity = day.weather.humidity
        $("#five-day").append(`<div id="five-day-element">
            <h5 class="five-day-text">${dateStr}</h5>
            <img class="icon" src=${day.weather.icon}></img>
            <h5 class="five-day-text">Temperature: ${temp}&#8457;</h5>
            <h5 class="five-day-text">Humidity: ${humidity}&#x0025;</h5>
        </div>`)
    })
    console.log("five day container added", $("#fiveDay"))
}


$(document).ready(() => {
    $("#query-input").change((event) => {
        if (event.target && event.target.value){
            query = event.target.value
        }
    })
    $("#search-btn").click(async () => {
        const todaysForcast = await fetchTodaysForcast(query)
        const fiveDayForcast = await fetchFiveDayForcast(query)
        setTodaysUI(todaysForcast)
        setFiveDayUI(fiveDayForcast)
    })
})