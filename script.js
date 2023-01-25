document.addEventListener('DOMContentLoaded', function() {
    var API_key = '45c2707f89d16318fbaddd18663434b4'
    $(document).ready(function() {
        $('#search_btn').click(function() {
            $('#results').empty()
            var location = document.getElementById('search_input')
            $.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location.value}&limit=5&appid=${API_key}`, function(data, status) {
                for (var i = 0; i < data.length; i++) {
                    var item = $(`<div class="result" data-location='["${data[i].lat}", "${data[i].lon}", "${data[i].name}"]'></div>`).text(`${data[i].name}, ${data[i].country}, ${data[i].state}`)
                    $('#results').append(item)
                }
                $('.result').click(function() {
                    var locData = $(this).data('location')
                    $('#results').empty()
                    $('#next_five').empty()
                    $('#icon').empty()

                    $.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${locData[0]}&lon=${locData[1]}&appid=${API_key}`, function(data, status) {
            
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
                    $.get(`https://api.openweathermap.org/data/2.5/weather?lat=${locData[0]}&lon=${locData[1]}&appid=${API_key}`, function(data, status) {
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

                })
            }) 
            
        })
        
    })
})