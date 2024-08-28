const urlBase = 'https://api.openweathermap.org/data/2.5/weather'
const API_KEY = 'e398943279042bac40d70394db47c73e'

const cityInput = document.getElementById('cityInput')
const weatherResponse = document.getElementById('weatherResponse')
const inputPlaceholder = 'Ej: Buenos Aires'
cityInput.placeholder = inputPlaceholder

const searchInputAction = (event) => {
    event.preventDefault()
    if(!validateSearchInput()){
        return false
    } else {
        weatherResponse.classList.remove('error-code')
        weatherResponse.innerHTML = ''
        cityInput.placeholder = inputPlaceholder
        weatherCitySearch()
    }
}

const validateSearchInput = () => {
    let isValid = true
    let cityValue = cityInput.value

    if(cityValue.trim() == ''){
        showError(cityInput, 'Ingrese una Ciudad...')
        isValid = false
    } else if (cityValue.length < 3){
        showError(cityInput, 'Ingrese mas de 3 caracteres...')
        isValid = false
    } else if (/\d/.test(cityValue)){
        showError(cityInput, 'No ingrese números...')
        isValid = false
    }

    return isValid
}

const showError = (ele, msg) => {
    document.getElementById('weatherSearch').classList.add('search-error')
    setTimeout(function(){
        document.getElementById('weatherSearch').classList.remove('search-error')
    }, 1000)
    ele.value = ''
    ele.placeholder = msg
    ele.focus()
}

async function weatherCitySearch() {
    const url = `${urlBase}?units=metric&q=${cityInput.value}&appid=${API_KEY}&lang=es`
    try {
        const response = await fetch(url)
        if(!response.ok){
            throw new Error(`No se encontraron resultados!`)
        }

        const json = await response.json()
        weatherWidgetUpdate(json)
    } catch (error) {
        weatherCitySearchError(error.message)
    }
}

const weatherCitySearchError = (msg) => {
    weatherResponse.innerHTML = msg
    weatherResponse.classList.add('error-code')
}

const currentDayName = () => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const currentDay = new Date()
    return days[currentDay.getDay()]
}

const weatherWidgetUpdate = (response) => {

    let description = response.weather[0].description
    let icon = response.weather[0].icon
    let cityName = response.name
    let countryName = response.sys.country
    let currentDay = currentDayName()
    let temp = response.main.temp
    let humidity = response.main.humidity

    weatherResponse.innerHTML = ''

    const eleContainer = document.createElement('div')
    eleContainer.id = 'weatherWidget'

    const eleContainerLeft = document.createElement('div')
    eleContainerLeft.classList.add('left')
    eleContainer.appendChild(eleContainerLeft)

    const eleContainerRight = document.createElement('div')
    eleContainerRight.classList.add('right')
    eleContainer.appendChild(eleContainerRight)

    const eleDesc = document.createElement('p')
    eleDesc.id = 'weatherDesc'
    eleDesc.textContent = description
    eleContainerLeft.appendChild(eleDesc)

    const eleImage = document.createElement('p')
    eleImage.id = 'weatherIcon'
    eleContainerLeft.appendChild(eleImage)

    const eleImageSrc = document.createElement('img')
    eleImageSrc.src = `https://openweathermap.org/img/wn/${icon}@2x.png`
    eleImage.appendChild(eleImageSrc)
    
    const eleCity = document.createElement('h1')
    eleCity.id = 'weatherCity'
    eleCity.textContent = `${cityName}, ${countryName}`
    eleContainerRight.appendChild(eleCity)

    const eleDay = document.createElement('h3')
    eleDay.id = 'weatherDay'
    eleDay.textContent = currentDay
    eleContainerRight.appendChild(eleDay)

    const eleTemp = document.createElement('p')
    eleTemp.id = 'weatherTemp'
    eleTemp.innerHTML = `${Math.floor(temp)}<span>°</span>`
    eleContainerRight.appendChild(eleTemp)

    const eleHum = document.createElement('p')
    eleHum.id = 'weatherHum'
    eleHum.innerHTML = `${humidity}<span>% Humedad</span>`
    eleContainerRight.appendChild(eleHum)

    weatherResponse.appendChild(eleContainer)

}

document.getElementById('searchBtn').addEventListener('click', searchInputAction)
document.getElementById('cityInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchInputAction(event)
    }
})

document.addEventListener('DOMContentLoaded', (event) => {
    setTimeout(function(){
        document.getElementById('weatherSearch').classList.remove('search-focus')
    }, 1000)
})