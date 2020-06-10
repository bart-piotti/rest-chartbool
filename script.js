$(document).ready(function() {
    var ctx = document.getElementById('myChart').getContext('2d');

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    var guadagni_per_mese = []

    $.ajax({
        'url': 'http://157.230.17.132:4018/sales',
        'method': 'GET',
        'error': function() {
            alert('error')
        },
        'success': function(data) {

            for (var i = 0; i < data.length; i++) {
                mese_data_corrente = moment(data[i].date, 'DD/MM/YYYY').format('M')
                if (typeof guadagni_per_mese[mese_data_corrente - 1] == 'undefined') {
                    guadagni_per_mese[mese_data_corrente - 1] = 0;
                }

                guadagni_per_mese[mese_data_corrente - 1] += data[i].amount;
            }
            lineChart(months, guadagni_per_mese)

        }
    })

    function lineChart(x, y) {
        var config = new Chart(ctx, {
            type: 'line',
            data: {
                labels: x,
                datasets: [{
                    label: 'Guadagno azienda (€)',
                    data: y,
                    fill: true,
                    borderColor: 'rgb(60,179,113)',
                    backgroundColor: 'rgba(60,179,113,.5)',
                    lineTension: 0,
                }],
            },//Data
            // options: {
            //     // This chart will not respond to mousemove, etc
            //     events: ['click']
            // }
        }); //New chart
    }

})//Ready
