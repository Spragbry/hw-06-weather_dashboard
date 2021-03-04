const FIVEDAY_WEATHER_ENDPOINT = "https://api.openweathermap.org/data/2.5/forecast"
const TODAYS_WEATHER_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather"
const API_KEY = "0316fa16dc8334829cbab528b156ea77"
let query = ""

const fetchFiveDayForcast = async (city) => {
    const url = `${FIVEDAY_WEATHER_ENDPOINT}?q=${city}&appid=${API_KEY}&units=imperial`
    const response = await fetch(url, {method:"GET"})
    const json = await response.json()
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
                const weather = item.main
                console.log("weather",weather)
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


fetchTodaysForcast = async (city) => {
    const url = `${TODAYS_WEATHER_ENDPOINT}?q=${city}&appid=${API_KEY}&units=imperial`
    const response = await fetch(url, {method:"GET"})
    const json = await response.json()
    let result = {
        date: moment(),
        weather: json.main,
        city: json.name
    }
    return result 
}

$(document).ready(() => {
    console.log("doc loaded")
    $("#query-input").keyup((event) => {
        if (event.target && event.target.value){
            query = event.target.value
        }
        console.log("text input change", event)
    })
    $("#search-btn").click(async () => {
        const todaysForcast = await fetchTodaysForcast(query)
        const fiveDayForcast = await fetchFiveDayForcast(query)
        console.log("Todays Forcast", todaysForcast)
        console.log("five day forcast", fiveDayForcast)
    })
    console.log("query input", $("#query-input"))
})