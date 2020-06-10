$(document).ready(function() {

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    var guadagni_per_mese = [];
    var guadagni_a_testa = {};
    var guadagno_annuale = 0;

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

                //Crea oggetto {Salesman: guadagno}
                if (guadagni_a_testa.hasOwnProperty(data[i].salesman)) {
                    guadagni_a_testa[data[i].salesman] += data[i].amount;
                } else {
                    guadagni_a_testa[data[i].salesman] = data[i].amount
                }

                //Somma tutti i guadagni per il totale annuale
                guadagno_annuale += data[i].amount
            }

            console.log(guadagni_a_testa);
            console.log(guadagno_annuale);
            lineChart(months, guadagni_per_mese)

            //Trasforma in percentuale i valori del guadagno a testa
            for (var key in guadagni_a_testa) {
                guadagni_a_testa[key] = (guadagni_a_testa[key] * 100 / guadagno_annuale).toFixed(1)
            }

            pieChart(Object.keys(guadagni_a_testa), Object.values(guadagni_a_testa))

        }
    })

    //Grafico 1
    var line_chart = document.getElementById('lineChart').getContext('2d');

    function lineChart(x, y) {
        var config = new Chart(line_chart, {
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
        }); //config
    }

    //Grafico 2
    var pie_chart = document.getElementById('pieChart').getContext('2d');

    function pieChart(x, y) {
        var config = new Chart(pie_chart, {
            type: 'pie',
            data: {
                labels: x,
                datasets: [{
                    data: y,
                    fill: true,
                    backgroundColor: ['#f4f6ff', '#f3c623', '#127681', '#10375c'],
                    hoverBackgroundColor: ['#f1f1fd'],
                    borderWidth: 0,
                }],
            },//Data
            options: {
                    legend: {
                        position: 'left'
                    },
                    title: {
                        display: true,
                        text: '% per salesman',
                        position: 'left',
                        fontSize: 30,
                        fontStyle: 'normal',
                    }
            }
        }); //config
    }

})//Ready
