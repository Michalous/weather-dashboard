document.addEventListener('DOMContentLoaded', function() {
    var API_key = '45c2707f89d16318fbaddd18663434b4'
    $(document).ready(function() {

        // shows data for London when page first loaded
        fiveDayForecast(51.5073219, -0.1276474)
        todayForecast(51.5073219, -0.1276474)
        displayHistory()

        //deals with bad requests - when user submits empty string, ",", etc.
        $(document).ajaxError(function(e, xhr, opt){
            if (xhr.statusText == 'Bad Request') {
                console.log("I'm dealing with the 400 Bad Request...")
                var div = $('<div class="red">Wrong request!</div>')
                $('#results').append(div)
            }
          })

        $('#search_btn').click(function() {
            $('#results').empty()
            var location = document.getElementById('search_input')
            
            // requests the coordinates of a city typed in by user
            $.get(`https://api.openweathermap.org/geo/1.0/direct?q=${location.value}&limit=5&appid=${API_key}`, function(data, status) {
            // if no result returned notifies user 
            if (data.length == 0) {
                var noResults = $('<div class="red">No result!</div>')
                $('#results').append(noResults) 
            }
            // displays options returned by request (up to 5)
            for (var i = 0; i < data.length; i++) {
                    var item = $(`<div class="result" data-name="${data[i].name}" data-location='["${data[i].lat}", "${data[i].lon}", "${data[i].name}"]'></div>`).text(`${data[i].name}, ${data[i].country}, ${data[i].state}`)
                    $('#results').append(item)
                }
                // specifies what happens when user clicks on one of the options
                $('.result').click(function() {
                    location.value = "" // clears input field
                    var locData = $(this).data('location')
                    var name = $(this).data('name')
                    $('#results').empty()
                    fiveDayForecast(locData[0], locData[1])
                    todayForecast(locData[0], locData[1])
                    saveToLocalStorage(locData[0], locData[1], name)
                    displayHistory()
                    topFunction()
                })
            
            })    
        })
    })

    // displays 5 day forecast returned data
    function fiveDayForecast(latitude, longitude) {
        $('#next_five').empty()
        $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_key}`, function(data, status) {

            for (var i = 4; i <= 36; i += 8) {
                var date = data.list[i]['dt_txt']
                var temperature = data.list[i]['main']['temp']
                var year = date.slice(0, 4)
                var month = date.slice(5, 7)
                var day = date.slice(8, 10)
                var wind = data.list[i]['wind']['speed']
                var humidity = data.list[i]['main']['humidity']
                var icon = data.list[i]['weather'][0]['icon']
                var newDay = $(`<div class="day">
                                <h4>${day}/${month}/${year}</h4>
                                <img class="five_icon" src="http://openweathermap.org/img/w/${icon}.png" alt="weather icon">
                                <p>Temp: ${(temperature - 273.15).toFixed(2)} &#8451</p>
                                <p>Wind: ${wind}</p>
                                <p>Humidity: ${humidity}%</p>`)
                $('#next_five').append(newDay)
            }      
        })
    }

    // displays current day data
    function todayForecast(latitude, longitude) {
        $('#icon').empty()
        $.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`, function(data, status) {
            var wind = data['wind']['speed']
            var humidity = data['main']['humidity']
            var temperature = data['main']['temp']
            var name = data['name']
            var icon = data['weather'][0]['icon']
            const today = new Date()
            var day = today.getDate()
            var month = today.getMonth() + 1
            var year = today.getFullYear()
            var writeDate = `(${day}/${month}/${year})`

            var newIcon = $(`<img id="main_icon" src="http://openweathermap.org/img/w/${icon}.png" alt="weather icon">`)

            $('#date').text(writeDate)
            $('#city_name').text(name)
            $('#icon').append(newIcon)
            $('#temperature').text((temperature - 273.15).toFixed(2))
            $('#humidity').text(humidity)
            $('#wind').text(wind)
        })
    }

    // saves searched city to local storage
    function saveToLocalStorage(latitude, longitude, city) {
        if (window.localStorage.getItem("cityObj") == null) {
            var cityObj = {}
            window.localStorage.setItem('cityObj', JSON.stringify(cityObj))
        }
        
        var cityObj = window.localStorage.getItem("cityObj")
        cityObj = JSON.parse(cityObj)
        var coordinates = [latitude, longitude]
        cityObj[city] = coordinates
        window.localStorage.setItem('cityObj', JSON.stringify(cityObj))
        
    }

    // displays cities saved in local storage
    function displayHistory() {
        $('#history_buttons').empty()
        if (window.localStorage.getItem("cityObj") != null) {
            var myObj = window.localStorage.getItem("cityObj")
            myObj = JSON.parse(myObj)
            for (var i in myObj) {
                var button = $(`<button class="history" data-lat="${myObj[i][0]}" data-lon="${myObj[i][1]}"></button>`).text(i)
                $('#history_buttons').prepend(button)
            }   
        }
        clickHistory()
    }

    // enables clicking on history entries and shows data of that entry
    function clickHistory() {
        $('.history').click(function() {
            var lat = $(this).data('lat')
            var lon = $(this).data('lon')
            todayForecast(lat, lon)
            fiveDayForecast(lat, lon)
            topFunction()
        })
    }
    // this was "borrowed" from W3Schools - scrolls back to top when user presses history button on mobile devices
    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
})