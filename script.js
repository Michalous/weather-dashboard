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
                    console.log(locData[1], locData[0])
                    $.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${locData[0]}&lon=${locData[1]}&appid=${API_key}`, function(data, status) {
                        console.log(data)
                        console.log(status)
                        var day = moment.unix(1318781876).utc()
                        for (var i in day) {
                            console.log(i)
                        }
                        console.log(day)
                        var date = new Date(1318781876)
                        console.log(date.toString())
                    })
                })
            }) 
            
        })
        
    })
})